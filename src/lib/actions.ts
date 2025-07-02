'use server';

import { collection, doc, getDoc, setDoc, query, orderBy, getDocs, addDoc, deleteDoc, where, limit } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { type HomepageStats, type Service, type Client } from '@/types';

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
      // Return default stats if document doesn't exist, this is expected on first run
      return defaultStats;
    }
  } catch (error) {
    console.error(
      'Error fetching homepage stats from Firestore. This is likely because the Firestore API has not been enabled for your project. Please visit https://console.developers.google.com/apis/api/firestore.googleapis.com/overview to enable it. Serving default stats.',
      error
    );
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
    revalidatePath('/'); // Revalidate the homepage to show new stats
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
        features: [
            "Custom Machine Learning Model Development",
            "Natural Language Processing (NLP)",
            "Predictive Analytics & Forecasting",
            "Computer Vision Solutions"
        ],
        iconName: "BrainCircuit",
        imageUrl: "https://placehold.co/600x400.png",
        order: 1
    },
    {
        slug: "cyber-security",
        title: "Comprehensive Cyber Security",
        description: "Protect your digital assets with our end-to-end cyber security services, from threat detection to incident response.",
        details: "In an increasingly digital world, cyber security is paramount. Our comprehensive security services provide 360-degree protection for your organization. We identify vulnerabilities, protect against threats, and ensure you are compliant with industry standards, giving you peace of mind.",
        features: [
            "Vulnerability Assessment & Penetration Testing",
            "Threat Detection & Incident Response",
            "Security Audits & Compliance",
            "Employee Security Training"
        ],
        iconName: "ShieldCheck",
        imageUrl: "https://placehold.co/600x400.png",
        order: 2
    },
    {
        slug: "graphic-design",
        title: "Creative Graphic Design",
        description: "Elevate your brand with stunning visuals. We offer comprehensive graphic design services from logo creation to full brand identity packages.",
        details: "Great design tells a story. Our creative team works with you to capture your brand's essence and translate it into compelling visuals. From a memorable logo to a complete brand identity, we craft designs that resonate with your audience and set you apart from the competition.",
        features: [
            "Logo Design & Brand Identity",
            "UI/UX Design for Web & Mobile",
            "Marketing Materials & Collateral",
            "Illustrations & Infographics"
        ],
        iconName: "Palette",
        imageUrl: "https://placehold.co/600x400.png",
        order: 3
    }
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
    if (!db) {
        console.warn('Firestore is not initialized.');
        return null;
    }
    try {
        const servicesCol = collection(db, 'services');
        const q = query(servicesCol, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Service;
    } catch (error) {
        console.error('Error fetching service by slug:', error);
        return null;
    }
}


export async function addService(service: Omit<Service, 'id'>): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firestore is not initialized.' };
    try {
        await addDoc(collection(db, 'services'), service);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        revalidatePath('/services');
        return { success: true, message: 'Service added successfully.' };
    } catch (error) {
        console.error('Error adding service:', error);
        return { success: false, message: 'Failed to add service.' };
    }
}

export async function updateService(id: string, service: Partial<Omit<Service, 'id'>>): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firestore is not initialized.' };
    try {
        const docRef = doc(db, 'services', id);
        await setDoc(docRef, service, { merge: true });
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        revalidatePath('/services');
        if (service.slug) {
            revalidatePath(`/services/${service.slug}`);
        }
        return { success: true, message: 'Service updated successfully.' };
    } catch (error) {
        console.error('Error updating service:', error);
        return { success: false, message: 'Failed to update service.' };
    }
}

export async function deleteService(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firestore is not initialized.' };
    try {
        const docRef = doc(db, 'services', id);
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

// Client Management Actions
const defaultClients: Omit<Client, 'id'>[] = [
  { name: 'Innovate Inc.', logoUrl: 'https://placehold.co/150x60.png' },
  { name: 'Future Corp.', logoUrl: 'https://placehold.co/150x60.png' },
  { name: 'Synergy Solutions', logoUrl: 'https://placehold.co/150x60.png' },
  { name: 'Apex Enterprises', logoUrl: 'https://placehold.co/150x60.png' },
];

export async function getClients(): Promise<Client[]> {
  if (!db) {
    console.warn('Firestore is not initialized. Serving default clients.');
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

export async function addClient(client: Omit<Client, 'id'>): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firestore is not initialized.' };
    try {
        await addDoc(collection(db, 'clients'), client);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Client added successfully.' };
    } catch (error) {
        console.error('Error adding client:', error);
        return { success: false, message: 'Failed to add client.' };
    }
}

export async function updateClient(id: string, client: Partial<Omit<Client, 'id'>>): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firestore is not initialized.' };
    try {
        const docRef = doc(db, 'clients', id);
        await setDoc(docRef, client, { merge: true });
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Client updated successfully.' };
    } catch (error) {
        console.error('Error updating client:', error);
        return { success: false, message: 'Failed to update client.' };
    }
}

export async function deleteClient(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firestore is not initialized.' };
    try {
        const docRef = doc(db, 'clients', id);
        await deleteDoc(docRef);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Client deleted successfully.' };
    } catch (error) {
        console.error('Error deleting client:', error);
        return { success: false, message: 'Failed to delete client.' };
    }
}
