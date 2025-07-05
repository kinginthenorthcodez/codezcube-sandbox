
'use server';

import { collection, doc, getDoc, setDoc, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, where, limit, type DocumentSnapshot, type QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { db, storage } from '@/lib/firebase';
import { type HomepageStats, type Service, type Client, type Testimonial, type HomepageContent, type SiteConfiguration, type PortfolioProject, type Product, type Course, type BlogPost, type ContactMessage } from '@/types';
import { format } from 'date-fns';

export async function getHomepageStats(): Promise<HomepageStats> {
  const defaultStats = {
    projectsCompleted: '0',
    clientSatisfaction: '0%',
    yearsOfExperience: '0',
  };

  if (!db) return defaultStats;

  try {
    const docRef = doc(db, 'homepage', 'stats');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as HomepageStats : defaultStats;
  } catch (error) {
    console.error('Error fetching homepage stats from Firestore.', error);
    return defaultStats;
  }
}

export async function updateHomepageStats(stats: HomepageStats): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: 'Firestore is not initialized.' };
  
  try {
    const docRef = doc(db, 'homepage', 'stats');
    await setDoc(docRef, stats);
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Homepage stats updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update stats: ${errorMessage}` };
  }
}

export async function getServices(): Promise<Service[]> {
  if (!db) return [];

  try {
    const servicesCol = collection(db, 'services');
    const q = query(servicesCol, orderBy('order'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
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
        return { success: false, message: 'Failed to delete service.' };
    }
}

export async function getClients(): Promise<Client[]> {
  if (!db) return [];

  try {
    const clientsCol = collection(db, 'clients');
    const q = query(clientsCol, orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
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
        return { success: false, message: 'Failed to delete client.' };
    }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!db) return [];

  try {
    const testimonialsCol = collection(db, 'testimonials');
    const q = query(testimonialsCol, orderBy('authorName'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
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

  if (!db) return defaultContent;

  try {
    const docRef = doc(db, 'homepage', 'content');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
          hero: { ...defaultContent.hero, ...data.hero },
          cta: { ...defaultContent.cta, ...data.cta },
      };
    } else {
      return defaultContent;
    }
  } catch (error) {
    console.error('Error fetching homepage content from Firestore.', error);
    return defaultContent;
  }
}

export async function updateHomepageContent(content: HomepageContent): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: 'Firestore is not initialized.' };
  
  try {
    const docRef = doc(db, 'homepage', 'content');
    await setDoc(docRef, content, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Homepage content updated successfully.' };
  } catch (error) {
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
    },
    contactInfo: {
      email: 'info@codezcube.com',
      phone: '+260 977 123 456',
      addressLine1: 'Lusaka, Zambia',
      addressLine2: '123 Innovation Drive, Woodlands',
    },
    calendlyUrl: 'https://calendly.com/codezcubedecodes/30min',
    privacyPolicy: 'Your privacy policy content goes here. Please edit this in the admin dashboard.',
    termsOfService: 'Your terms of service content goes here. Please edit this in the admin dashboard.',
    cookiePolicy: 'Your cookie policy content goes here. Please edit this in the admin dashboard.',
  };

  if (!db) return defaultSiteConfig;

  try {
    const docRef = doc(db, 'site', 'configuration');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        ...defaultSiteConfig,
        ...data,
        socialLinks: { ...defaultSiteConfig.socialLinks, ...data.socialLinks },
        contactInfo: { ...defaultSiteConfig.contactInfo, ...data.contactInfo },
      };
    } else {
      return defaultSiteConfig;
    }
  } catch (error) {
    console.error('Error fetching site configuration from Firestore.', error);
    return defaultSiteConfig;
  }
}

export async function updateSiteConfiguration(config: SiteConfiguration): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: 'Firestore is not initialized.' };
  
  try {
    const docRef = doc(db, 'site', 'configuration');
    await setDoc(docRef, config, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    revalidatePath('/contact');
    revalidatePath('/booking');
    revalidatePath('/privacy-policy');
    revalidatePath('/terms-of-service');
    revalidatePath('/cookie-policy');
    return { success: true, message: 'Site configuration updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update site config: ${errorMessage}` };
  }
}

// Portfolio Project Actions
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
        problemStatement: data.problemStatement || data.details || '',
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
    if (!db) return [];
    
    try {
        const projectsCol = collection(db, 'portfolio');
        const q = query(projectsCol, orderBy('order'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(mapDocToProject);
    } catch (error) {
        console.error('Error fetching portfolio projects:', error);
        return [];
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
        return { success: false, message: 'Failed to delete project.' };
    }
}

// Product Actions
export async function getProducts(): Promise<Product[]> {
    if (!db) return [];
    
    try {
        const productsCol = collection(db, 'products');
        const q = query(productsCol, orderBy('order'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function addProduct(formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db || !storage) return { success: false, message: 'Firebase is not initialized.' };

    const imageFile = formData.get('imageFile') as File;
    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'Product image is required.' };
    }

    try {
        const { url, storagePath } = await handleFileUpload(imageFile, 'product-images');
        const newProduct: Omit<Product, 'id'> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            productUrl: formData.get('productUrl') as string,
            order: Number(formData.get('order')),
            imageUrl: url,
            imageStoragePath: storagePath,
        };

        await addDoc(collection(db, 'products'), newProduct);
        revalidatePath('/admin/dashboard');
        revalidatePath('/products');
        return { success: true, message: 'Product added successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to add product.' };
    }
}

export async function updateProduct(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };

    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: 'Product not found.' };

        const existingProduct = docSnap.data() as Product;
        const productUpdate: Partial<Product> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            productUrl: formData.get('productUrl') as string,
            order: Number(formData.get('order')),
        };

        const imageFile = formData.get('imageFile') as File;
        if (imageFile && imageFile.size > 0) {
            await handleDeleteFile(existingProduct.imageStoragePath);
            const { url, storagePath } = await handleFileUpload(imageFile, 'product-images');
            productUpdate.imageUrl = url;
            productUpdate.imageStoragePath = storagePath;
        }

        await updateDoc(docRef, productUpdate);
        revalidatePath('/admin/dashboard');
        revalidatePath('/products');
        return { success: true, message: 'Product updated successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to update product.' };
    }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await handleDeleteFile(docSnap.data().imageStoragePath);
        }
        await deleteDoc(docRef);
        revalidatePath('/admin/dashboard');
        revalidatePath('/products');
        return { success: true, message: 'Product deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to delete product.' };
    }
}

// Course Actions
export async function getCourses(): Promise<Course[]> {
    if (!db) return [];
    
    try {
        const coursesCol = collection(db, 'courses');
        const querySnapshot = await getDocs(coursesCol);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
    if (!db) return null;
    try {
        const q = query(collection(db, 'courses'), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Course;
    } catch (error) {
        console.error('Error fetching course by slug:', error);
        return null;
    }
}

export async function addCourse(formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db || !storage) return { success: false, message: 'Firebase is not initialized.' };

    const imageFile = formData.get('imageFile') as File;
    if (!imageFile || imageFile.size === 0) return { success: false, message: 'Course image is required.' };

    try {
        const { url, storagePath } = await handleFileUpload(imageFile, 'course-images');
        const newCourse: Omit<Course, 'id'> = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            description: formData.get('description') as string,
            level: formData.get('level') as string,
            duration: formData.get('duration') as string,
            modules: (formData.get('modules') as string).split('\n').map(m => m.trim()).filter(m => m),
            dataAiHint: formData.get('dataAiHint') as string,
            imageUrl: url,
            imageStoragePath: storagePath,
        };

        await addDoc(collection(db, 'courses'), newCourse);
        revalidatePath('/admin/dashboard');
        revalidatePath('/courses');
        return { success: true, message: 'Course added successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to add course.' };
    }
}

export async function updateCourse(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };

    try {
        const docRef = doc(db, 'courses', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: 'Course not found.' };

        const existingCourse = docSnap.data() as Course;
        const courseUpdate: Partial<Course> = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            description: formData.get('description') as string,
            level: formData.get('level') as string,
            duration: formData.get('duration') as string,
            modules: (formData.get('modules') as string).split('\n').map(m => m.trim()).filter(m => m),
            dataAiHint: formData.get('dataAiHint') as string,
        };

        const imageFile = formData.get('imageFile') as File;
        if (imageFile && imageFile.size > 0) {
            await handleDeleteFile(existingCourse.imageStoragePath);
            const { url, storagePath } = await handleFileUpload(imageFile, 'course-images');
            courseUpdate.imageUrl = url;
            courseUpdate.imageStoragePath = storagePath;
        }

        await updateDoc(docRef, courseUpdate);
        revalidatePath('/admin/dashboard');
        revalidatePath('/courses');
        revalidatePath(`/courses/${courseUpdate.slug}`);
        return { success: true, message: 'Course updated successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to update course.' };
    }
}

export async function deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };
    try {
        const docRef = doc(db, 'courses', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await handleDeleteFile(docSnap.data().imageStoragePath);
        }
        await deleteDoc(docRef);
        revalidatePath('/admin/dashboard');
        revalidatePath('/courses');
        return { success: true, message: 'Course deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to delete course.' };
    }
}

// Blog Post (Career Advice) Actions
export async function getBlogPosts(): Promise<BlogPost[]> {
    if (!db) return [];
    
    try {
        const blogPostsCol = collection(db, 'blogPosts');
        const q = query(blogPostsCol, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!db) return null;
    try {
        const q = query(collection(db, 'blogPosts'), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as BlogPost;
    } catch (error) {
        console.error('Error fetching blog post by slug:', error);
        return null;
    }
}

export async function addBlogPost(formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db || !storage) return { success: false, message: 'Firebase is not initialized.' };

    const imageFile = formData.get('imageFile') as File;
    if (!imageFile || imageFile.size === 0) return { success: false, message: 'Post image is required.' };

    try {
        const { url, storagePath } = await handleFileUpload(imageFile, 'blog-images');
        const newPost: Omit<BlogPost, 'id'> = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            author: formData.get('author') as string,
            date: format(new Date(), 'MMMM d, yyyy'),
            category: formData.get('category') as string,
            excerpt: formData.get('excerpt') as string,
            content: formData.get('content') as string,
            imageUrl: url,
            imageStoragePath: storagePath,
        };

        await addDoc(collection(db, 'blogPosts'), newPost);
        revalidatePath('/admin/dashboard');
        revalidatePath('/blog');
        revalidatePath('/courses');
        return { success: true, message: 'Blog post added successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to add blog post.' };
    }
}

export async function updateBlogPost(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };

    try {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: 'Blog post not found.' };

        const existingPost = docSnap.data() as BlogPost;
        const postUpdate: Partial<BlogPost> = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            author: formData.get('author') as string,
            category: formData.get('category') as string,
            excerpt: formData.get('excerpt') as string,
            content: formData.get('content') as string,
            // Date is not updated on edit
        };

        const imageFile = formData.get('imageFile') as File;
        if (imageFile && imageFile.size > 0) {
            await handleDeleteFile(existingPost.imageStoragePath);
            const { url, storagePath } = await handleFileUpload(imageFile, 'blog-images');
            postUpdate.imageUrl = url;
            postUpdate.imageStoragePath = storagePath;
        }

        await updateDoc(docRef, postUpdate);
        revalidatePath('/admin/dashboard');
        revalidatePath('/blog');
        revalidatePath(`/blog/${postUpdate.slug}`);
        revalidatePath('/courses');
        return { success: true, message: 'Blog post updated successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to update blog post.' };
    }
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };
    try {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await handleDeleteFile(docSnap.data().imageStoragePath);
        }
        await deleteDoc(docRef);
        revalidatePath('/admin/dashboard');
        revalidatePath('/blog');
        revalidatePath('/courses');
        return { success: true, message: 'Blog post deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to delete blog post.' };
    }
}

// Contact Message Actions
export async function saveContactMessage(data: Omit<ContactMessage, 'id' | 'receivedAt' | 'isRead'>): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: 'Firestore is not initialized.' };
  
  try {
    const newMessage = {
      ...data,
      receivedAt: Timestamp.now(),
      isRead: false,
    };
    await addDoc(collection(db, 'messages'), newMessage);
    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to send message: ${errorMessage}` };
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (!db) return [];

  try {
    const messagesCol = collection(db, 'messages');
    const q = query(messagesCol, orderBy('receivedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const receivedAtDate = (data.receivedAt as Timestamp).toDate();
        return { 
            id: doc.id,
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            isRead: data.isRead,
            receivedAt: format(receivedAtDate, "PPpp"), // Format to a readable string e.g. "Sep 21, 2023, 4:25:31 PM"
         } as ContactMessage
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function deleteMessage(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };
    try {
        await deleteDoc(doc(db, 'messages', id));
        revalidatePath('/admin/dashboard/messages');
        return { success: true, message: 'Message deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to delete message.' };
    }
}

export async function updateMessageStatus(id: string, isRead: boolean): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firebase is not initialized.' };
    try {
        const docRef = doc(db, 'messages', id);
        await updateDoc(docRef, { isRead });
        revalidatePath('/admin/dashboard/messages');
        return { success: true, message: 'Message status updated.' };
    } catch (error) {
        return { success: false, message: 'Failed to update message status.' };
    }
}
