
'use server';

import { collection, doc, getDoc, setDoc, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, where, limit, type DocumentSnapshot, type QueryDocumentSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { db, storage } from '@/lib/firebase';
import { type HomepageStats, type Service, type Client, type Testimonial, type HomepageContent, type SiteConfiguration, type PortfolioProject } from '@/types';

export async function getHomepageStats(): Promise<HomepageStats> {
  const defaultStats = {
    projectsCompleted: '50+',
    clientSatisfaction: '98%',
    yearsOfExperience: '5+',
  };

  if (!db) {
    console.warn('Firestore is not initialized. Serving default stats.');
    return defaultStats;
  }

  try {
    const docRef = doc(db, 'homepage', 'stats');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as HomepageStats;
    } else {
      return defaultStats;
    }
  } catch (error) {
    console.error('Error fetching homepage stats from Firestore.', error);
    return defaultStats;
  }
}

export async function updateHomepageStats(stats: HomepageStats): Promise<{ success: boolean; message: string }> {
  if (!db) {
    return { success: false, message: 'Firestore is not initialized.' };
  }
  try {
    const docRef = doc(db, 'homepage', 'stats');
    await setDoc(docRef, stats);
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Homepage stats updated successfully.' };
  } catch (error) {
    console.error('Error updating stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update stats: ${errorMessage}` };
  }
}

const defaultServices: Omit<Service, 'id'>[] = [
    {
        slug: "ai-ml-solutions",
        title: "AI/ML Solutions",
        description: "Leveraging Artificial Intelligence and Machine Learning to unlock insights, automate processes, and create intelligent products.",
        details: "Our AI/ML solutions are designed to help your business harness the power of data. We build custom models and integrate intelligent algorithms to solve complex problems, from predictive analytics to natural language processing. Let us help you transform your data into a competitive advantage.",
        features: [ "Custom Machine Learning Model Development", "Natural Language Processing (NLP)", "Predictive Analytics & Forecasting", "Computer Vision Solutions" ],
        iconName: "BrainCircuit",
        imageUrl: "https://placehold.co/600x400.png",
        imageStoragePath: "",
        order: 1
    },
];

export async function getServices(): Promise<Service[]> {
  if (!db) {
    console.warn('Firestore is not initialized. Serving default services.');
    return defaultServices.map((o, i) => ({ ...o, id: `default-${i}` }));
  }
  try {
    const servicesCol = collection(db, 'services');
    const q = query(servicesCol, orderBy('order'));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No services found, seeding with default data.');
      for (const service of defaultServices) {
        await addDoc(collection(db, 'services'), service);
      }
      const seededSnapshot = await getDocs(q);
      return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    }
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  } catch (error) {
    console.error('Error fetching services:', error);
    return defaultServices.map((o, i) => ({ ...o, id: `default-${i}` }));
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
    if (!db) return null;
    try {
        const q = query(collection(db, 'services'), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Service;
    } catch (error) {
        console.error('Error fetching service by slug:', error);
        return null;
    }
}

async function handleFileUpload(file: File, path: string): Promise<{ url: string, storagePath: string }> {
    if (!storage) throw new Error("Firebase Storage is not initialized.");
    const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, storagePath: storageRef.fullPath };
}

async function handleDeleteFile(storagePath: string) {
    if (!storage || !storagePath) return;
    const fileRef = ref(storage, storagePath);
    try {
        await deleteObject(fileRef);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting file from storage:", error);
        }
    }
}

export async function addService(formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db || !storage) return { success: false, message: 'Firebase is not initialized.' };

    const imageFile = formData.get('imageFile') as File;
    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'Service image is required.' };
    }

    try {
        const { url, storagePath } = await handleFileUpload(imageFile, 'service-images');
        const newService = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            description: formData.get('description') as string,
            details: formData.get('details') as string,
            iconName: formData.get('iconName') as string,
            features: (formData.get('features') as string).split('\n').map(f => f.trim()).filter(f => f),
            order: Number(formData.get('order')),
            imageUrl: url,
            imageStoragePath: storagePath,
        };

        await addDoc(collection(db, 'services'), newService);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        revalidatePath('/services');
        return { success: true, message: 'Service added successfully.' };
    } catch (error) {
        console.error('Error adding service:', error);
        return { success: false, message: 'Failed to add service.' };
    }
}

export async function updateService(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };

    try {
        const docRef = doc(db, 'services', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: 'Service not found.' };

        const existingService = docSnap.data() as Service;
        const serviceUpdate: Partial<Service> = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            description: formData.get('description') as string,
            details: formData.get('details') as string,
            iconName: formData.get('iconName') as string,
            features: (formData.get('features') as string).split('\n').map(f => f.trim()).filter(f => f),
            order: Number(formData.get('order')),
        };

        const imageFile = formData.get('imageFile') as File;
        if (imageFile && imageFile.size > 0) {
            await handleDeleteFile(existingService.imageStoragePath);
            const { url, storagePath } = await handleFileUpload(imageFile, 'service-images');
            serviceUpdate.imageUrl = url;
            serviceUpdate.imageStoragePath = storagePath;
        }

        await updateDoc(docRef, serviceUpdate);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        revalidatePath('/services');
        revalidatePath(`/services/${serviceUpdate.slug}`);
        return { success: true, message: 'Service updated successfully.' };
    } catch (error) {
        console.error('Error updating service:', error);
        return { success: false, message: 'Failed to update service.' };
    }
}

export async function deleteService(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };
    try {
        const docRef = doc(db, 'services', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await handleDeleteFile(docSnap.data().imageStoragePath);
        }
        await deleteDoc(docRef);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        revalidatePath('/services');
        return { success: true, message: 'Service deleted successfully.' };
    } catch (error) {
        console.error('Error deleting service:', error);
        return { success: false, message: 'Failed to delete service.' };
    }
}

const defaultClients: Omit<Client, 'id'>[] = [
  { name: 'Innovate Inc.', logoUrl: 'https://placehold.co/150x60.png', logoStoragePath: '', dataAiHint: 'tech company' },
];

export async function getClients(): Promise<Client[]> {
  if (!db) {
    return defaultClients.map((c, i) => ({ ...c, id: `default-${i}` }));
  }
  try {
    const clientsCol = collection(db, 'clients');
    const q = query(clientsCol, orderBy('name'));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No clients found, seeding with default data.');
      for (const client of defaultClients) {
        await addDoc(collection(db, 'clients'), client);
      }
      const seededSnapshot = await getDocs(q);
      return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
    }
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
  } catch (error) {
    console.error('Error fetching clients:', error);
    return defaultClients.map((c, i) => ({ ...c, id: `default-${i}` }));
  }
}

export async function addClient(formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db || !storage) return { success: false, message: 'Firebase is not initialized.' };

    const logoFile = formData.get('logoFile') as File;
    if (!logoFile || logoFile.size === 0) {
        return { success: false, message: 'Client logo is required.' };
    }

    try {
        const { url, storagePath } = await handleFileUpload(logoFile, 'client-logos');
        const newClient: Omit<Client, 'id'> = {
            name: formData.get('name') as string,
            dataAiHint: formData.get('dataAiHint') as string,
            logoUrl: url,
            logoStoragePath: storagePath,
        };

        await addDoc(collection(db, 'clients'), newClient);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Client added successfully.' };
    } catch (error) {
        console.error('Error adding client:', error);
        return { success: false, message: 'Failed to add client.' };
    }
}

export async function updateClient(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };

    try {
        const docRef = doc(db, 'clients', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: 'Client not found.' };

        const existingClient = docSnap.data() as Client;
        const clientUpdate: Partial<Client> = {
            name: formData.get('name') as string,
            dataAiHint: formData.get('dataAiHint') as string,
        };

        const logoFile = formData.get('logoFile') as File;
        if (logoFile && logoFile.size > 0) {
            await handleDeleteFile(existingClient.logoStoragePath);
            const { url, storagePath } = await handleFileUpload(logoFile, 'client-logos');
            clientUpdate.logoUrl = url;
            clientUpdate.logoStoragePath = storagePath;
        }

        await updateDoc(docRef, clientUpdate);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Client updated successfully.' };
    } catch (error) {
        console.error('Error updating client:', error);
        return { success: false, message: 'Failed to update client.' };
    }
}

export async function deleteClient(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };
    try {
        const docRef = doc(db, 'clients', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await handleDeleteFile(docSnap.data().logoStoragePath);
        }
        await deleteDoc(docRef);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Client deleted successfully.' };
    } catch (error) {
        console.error('Error deleting client:', error);
        return { success: false, message: 'Failed to delete client.' };
    }
}

const defaultTestimonials: Omit<Testimonial, 'id'>[] = [
  {
    quote: "Working with Codezcube was a game-changer for our organization. Their team is not only technically proficient but also deeply committed to our success. They delivered beyond our expectations.",
    authorName: "Jane Doe",
    authorTitle: "CEO, Acme Inc.",
    avatarUrl: "https://github.com/shadcn.png",
    avatarStoragePath: "",
    rating: 5,
  },
];

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!db) {
    return defaultTestimonials.map((t, i) => ({ ...t, id: `default-${i}` }));
  }
  try {
    const testimonialsCol = collection(db, 'testimonials');
    const q = query(testimonialsCol, orderBy('authorName'));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No testimonials found, seeding with default data.');
      for (const testimonial of defaultTestimonials) {
        await addDoc(collection(db, 'testimonials'), testimonial);
      }
      const seededSnapshot = await getDocs(q);
      return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    }
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return defaultTestimonials.map((t, i) => ({ ...t, id: `default-${i}` }));
  }
}

export async function addTestimonial(formData: FormData): Promise<{ success: boolean; message: string }> {
  if (!db || !storage) return { success: false, message: 'Firebase is not initialized.' };

  const avatarFile = formData.get('avatarFile') as File;
  if (!avatarFile || avatarFile.size === 0) {
    return { success: false, message: 'Author avatar is required.' };
  }

  try {
    const { url, storagePath } = await handleFileUpload(avatarFile, 'testimonial-avatars');
    const newTestimonial: Omit<Testimonial, 'id'> = {
      quote: formData.get('quote') as string,
      authorName: formData.get('authorName') as string,
      authorTitle: formData.get('authorTitle') as string,
      rating: Number(formData.get('rating')),
      avatarUrl: url,
      avatarStoragePath: storagePath,
    };

    await addDoc(collection(db, 'testimonials'), newTestimonial);
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Testimonial added successfully.' };
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return { success: false, message: 'Failed to add testimonial.' };
  }
}

export async function updateTestimonial(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: 'Firebase is not initialized.' };

  try {
    const docRef = doc(db, 'testimonials', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { success: false, message: 'Testimonial not found.' };

    const existingTestimonial = docSnap.data() as Testimonial;
    const testimonialUpdate: Partial<Testimonial> = {
      quote: formData.get('quote') as string,
      authorName: formData.get('authorName') as string,
      authorTitle: formData.get('authorTitle') as string,
      rating: Number(formData.get('rating')),
    };

    const avatarFile = formData.get('avatarFile') as File;
    if (avatarFile && avatarFile.size > 0) {
      await handleDeleteFile(existingTestimonial.avatarStoragePath);
      const { url, storagePath } = await handleFileUpload(avatarFile, 'testimonial-avatars');
      testimonialUpdate.avatarUrl = url;
      testimonialUpdate.avatarStoragePath = storagePath;
    }

    await updateDoc(docRef, testimonialUpdate);
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Testimonial updated successfully.' };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return { success: false, message: 'Failed to update testimonial.' };
  }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: 'Firebase is not initialized.' };
  try {
    const docRef = doc(db, 'testimonials', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await handleDeleteFile(docSnap.data().avatarStoragePath);
    }
    await deleteDoc(docRef);
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Testimonial deleted successfully.' };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return { success: false, message: 'Failed to delete testimonial.' };
  }
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const defaultContent: HomepageContent = {
    hero: {
      headline: 'Innovate. Build. Empower.',
      subtext: 'Codezcube delivers cutting-edge Web Development, Mobile Development, AI/ML, and EdTech solutions to transform your ideas into reality.',
      ctaText: 'Discover Our Services',
      ctaLink: '/services',
    },
    cta: {
      headline: 'Ready to Elevate Your Business?',
      subtext: "Let's discuss how Codezcube can help you achieve your goals with our innovative tech solutions. Schedule a free consultation today!",
      ctaText: 'Book a Free Consultation',
      ctaLink: '/booking',
    }
  };

  if (!db) {
    console.warn('Firestore is not initialized. Serving default content.');
    return defaultContent;
  }

  try {
    const docRef = doc(db, 'homepage', 'content');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Deep merge with defaults to handle cases where new fields were added
      return {
          hero: { ...defaultContent.hero, ...data.hero },
          cta: { ...defaultContent.cta, ...data.cta },
      };
    } else {
      await setDoc(docRef, defaultContent);
      return defaultContent;
    }
  } catch (error) {
    console.error('Error fetching homepage content from Firestore.', error);
    return defaultContent;
  }
}

export async function updateHomepageContent(content: HomepageContent): Promise<{ success: boolean; message: string }> {
  if (!db) {
    return { success: false, message: 'Firestore is not initialized.' };
  }
  try {
    const docRef = doc(db, 'homepage', 'content');
    await setDoc(docRef, content, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Homepage content updated successfully.' };
  } catch (error) {
    console.error('Error updating content:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update content: ${errorMessage}` };
  }
}

export async function getSiteConfiguration(): Promise<SiteConfiguration> {
  const defaultSiteConfig: SiteConfiguration = {
    socialLinks: {
      github: '#',
      twitter: '#',
      linkedin: '#',
    }
  };

  if (!db) {
    console.warn('Firestore is not initialized. Serving default site config.');
    return defaultSiteConfig;
  }

  try {
    const docRef = doc(db, 'site', 'configuration');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { socialLinks: { ...defaultSiteConfig.socialLinks, ...data.socialLinks } };
    } else {
      await setDoc(docRef, defaultSiteConfig);
      return defaultSiteConfig;
    }
  } catch (error) {
    console.error('Error fetching site configuration from Firestore.', error);
    return defaultSiteConfig;
  }
}

export async function updateSiteConfiguration(config: SiteConfiguration): Promise<{ success: boolean; message: string }> {
  if (!db) {
    return { success: false, message: 'Firestore is not initialized.' };
  }
  try {
    const docRef = doc(db, 'site', 'configuration');
    await setDoc(docRef, config, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Site configuration updated successfully.' };
  } catch (error) {
    console.error('Error updating site config:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update site config: ${errorMessage}` };
  }
}

// Portfolio Project Actions
const defaultPortfolioProjects: Omit<PortfolioProject, 'id'>[] = [
    {
        slug: "ecommerce-platform-revamp",
        title: "E-commerce Platform Revamp",
        category: "Web Development",
        description: "A complete overhaul of a leading online retailer's platform to enhance user experience and improve performance.",
        tags: ["Next.js", "Firebase", "E-commerce", "UX/UI Design"],
        imageUrl: "https://placehold.co/600x400.png",
        imageStoragePath: "",
        order: 1,
        problemStatement: "We partnered with a major e-commerce brand to redesign and rebuild their online platform from the ground up. The project involved migrating to a modern tech stack (Next.js, Firebase), implementing a new design system for a responsive user interface, and optimizing the backend for faster load times and scalability. The new platform resulted in a 40% increase in conversion rates and a 60% improvement in page load speed.",
        targetAudience: "This section will detail the target audience for the project and the strategic approach taken to meet their needs.",
        myRole: "This section will describe my specific role and responsibilities throughout the project lifecycle.",
        designThinkingProcess: "This section provides an overview of the design thinking methodology applied to this project.",
        projectTimeline: "A summary of the project timeline and key milestones.",
        qualitativeResearch: "Details about the qualitative research methods used, such as user interviews and observations.",
        quantitativeResearch: "Details about quantitative research methods like surveys and analytics review.",
        userPersona: "A detailed user persona developed from the research findings.",
        empathyMap: "An empathy map to visualize user attitudes and behaviors.",
        taskFlow: "Diagrams or descriptions of the primary user task flows.",
        cardSorting: "Information on how card sorting was used to inform the information architecture.",
        informationArchitecture: "The resulting information architecture for the application.",
        highFidelityPrototypes: "Showcase of the high-fidelity prototypes created for user testing.",
        typographyAndColors: "The typography choices and color palette defined for the project.",
        visualDesigns: "Final visual designs and key screens of the application.",
        thankYouNote: "Thank you for reviewing this case study. I hope it provided valuable insight into my process and capabilities. Feel free to reach out with any questions!"
    },
];

const mapDocToProject = (doc: QueryDocumentSnapshot | DocumentSnapshot): PortfolioProject => {
    const data = doc.data() || {};
    return {
        id: doc.id,
        slug: data.slug || '',
        title: data.title || '',
        category: data.category || '',
        description: data.description || '',
        tags: data.tags || [],
        imageUrl: data.imageUrl || '',
        imageStoragePath: data.imageStoragePath || '',
        order: data.order || 0,
        problemStatement: data.problemStatement || data.details || '', // backward compatibility
        targetAudience: data.targetAudience || '',
        myRole: data.myRole || '',
        designThinkingProcess: data.designThinkingProcess || '',
        projectTimeline: data.projectTimeline || '',
        qualitativeResearch: data.qualitativeResearch || '',
        quantitativeResearch: data.quantitativeResearch || '',
        userPersona: data.userPersona || '',
        empathyMap: data.empathyMap || '',
        taskFlow: data.taskFlow || '',
        cardSorting: data.cardSorting || '',
        informationArchitecture: data.informationArchitecture || '',
        highFidelityPrototypes: data.highFidelityPrototypes || '',
        typographyAndColors: data.typographyAndColors || '',
        visualDesigns: data.visualDesigns || '',
        thankYouNote: data.thankYouNote || '',
    };
};


export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
    if (!db) {
        console.warn('Firestore is not initialized. Serving default projects.');
        return defaultPortfolioProjects.map((p, i) => ({ ...p, id: `default-${i}` }));
    }
    try {
        const projectsCol = collection(db, 'portfolio');
        const q = query(projectsCol, orderBy('order'));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log('No portfolio projects found, seeding with default data.');
            for (const project of defaultPortfolioProjects) {
                await addDoc(collection(db, 'portfolio'), project);
            }
            const seededSnapshot = await getDocs(q);
            return seededSnapshot.docs.map(mapDocToProject);
        }
        return querySnapshot.docs.map(mapDocToProject);
    } catch (error) {
        console.error('Error fetching portfolio projects:', error);
        return defaultPortfolioProjects.map((p, i) => ({ ...p, id: `default-${i}` }));
    }
}

export async function getPortfolioProjectBySlug(slug: string): Promise<PortfolioProject | null> {
    if (!db) return null;
    try {
        const q = query(collection(db, 'portfolio'), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        return mapDocToProject(querySnapshot.docs[0]);
    } catch (error) {
        console.error('Error fetching portfolio project by slug:', error);
        return null;
    }
}

export async function addPortfolioProject(formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db || !storage) return { success: false, message: 'Firebase is not initialized.' };

    const imageFile = formData.get('imageFile') as File;
    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'Project image is required.' };
    }

    try {
        const { url, storagePath } = await handleFileUpload(imageFile, 'portfolio-images');
        const newProject = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            tags: (formData.get('tags') as string).split('\n').map(t => t.trim()).filter(t => t),
            order: Number(formData.get('order')),
            imageUrl: url,
            imageStoragePath: storagePath,
            problemStatement: formData.get('problemStatement') as string,
            targetAudience: formData.get('targetAudience') as string,
            myRole: formData.get('myRole') as string,
            designThinkingProcess: formData.get('designThinkingProcess') as string,
            projectTimeline: formData.get('projectTimeline') as string,
            qualitativeResearch: formData.get('qualitativeResearch') as string,
            quantitativeResearch: formData.get('quantitativeResearch') as string,
            userPersona: formData.get('userPersona') as string,
            empathyMap: formData.get('empathyMap') as string,
            taskFlow: formData.get('taskFlow') as string,
            cardSorting: formData.get('cardSorting') as string,
            informationArchitecture: formData.get('informationArchitecture') as string,
            highFidelityPrototypes: formData.get('highFidelityPrototypes') as string,
            typographyAndColors: formData.get('typographyAndColors') as string,
            visualDesigns: formData.get('visualDesigns') as string,
            thankYouNote: formData.get('thankYouNote') as string,
        };

        await addDoc(collection(db, 'portfolio'), newProject);
        revalidatePath('/admin/dashboard');
        revalidatePath('/portfolio');
        return { success: true, message: 'Project added successfully.' };
    } catch (error) {
        console.error('Error adding project:', error);
        return { success: false, message: 'Failed to add project.' };
    }
}

export async function updatePortfolioProject(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };

    try {
        const docRef = doc(db, 'portfolio', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: 'Project not found.' };

        const existingProject = docSnap.data() as PortfolioProject;
        const projectUpdate: Partial<PortfolioProject> = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            tags: (formData.get('tags') as string).split('\n').map(t => t.trim()).filter(t => t),
            order: Number(formData.get('order')),
            problemStatement: formData.get('problemStatement') as string,
            targetAudience: formData.get('targetAudience') as string,
            myRole: formData.get('myRole') as string,
            designThinkingProcess: formData.get('designThinkingProcess') as string,
            projectTimeline: formData.get('projectTimeline') as string,
            qualitativeResearch: formData.get('qualitativeResearch') as string,
            quantitativeResearch: formData.get('quantitativeResearch') as string,
            userPersona: formData.get('userPersona') as string,
            empathyMap: formData.get('empathyMap') as string,
            taskFlow: formData.get('taskFlow') as string,
            cardSorting: formData.get('cardSorting') as string,
            informationArchitecture: formData.get('informationArchitecture') as string,
            highFidelityPrototypes: formData.get('highFidelityPrototypes') as string,
            typographyAndColors: formData.get('typographyAndColors') as string,
            visualDesigns: formData.get('visualDesigns') as string,
            thankYouNote: formData.get('thankYouNote') as string,
        };

        const imageFile = formData.get('imageFile') as File;
        if (imageFile && imageFile.size > 0) {
            await handleDeleteFile(existingProject.imageStoragePath);
            const { url, storagePath } = await handleFileUpload(imageFile, 'portfolio-images');
            projectUpdate.imageUrl = url;
            projectUpdate.imageStoragePath = storagePath;
        }

        await updateDoc(docRef, projectUpdate);
        revalidatePath('/admin/dashboard');
        revalidatePath('/portfolio');
        revalidatePath(`/portfolio/${projectUpdate.slug}`);
        return { success: true, message: 'Project updated successfully.' };
    } catch (error) {
        console.error('Error updating project:', error);
        return { success: false, message: 'Failed to update project.' };
    }
}

export async function deletePortfolioProject(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };
    try {
        const docRef = doc(db, 'portfolio', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await handleDeleteFile(docSnap.data().imageStoragePath);
        }
        await deleteDoc(docRef);
        revalidatePath('/admin/dashboard');
        revalidatePath('/portfolio');
        return { success: true, message: 'Project deleted successfully.' };
    } catch (error) {
        console.error('Error deleting project:', error);
        return { success: false, message: 'Failed to delete project.' };
    }
}
