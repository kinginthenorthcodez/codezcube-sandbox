'use server';

import { collection, doc, getDoc, setDoc, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, where, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { db, storage } from '@/lib/firebase';
import { type HomepageStats, type Service, type Client, type Testimonial } from '@/types';

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
