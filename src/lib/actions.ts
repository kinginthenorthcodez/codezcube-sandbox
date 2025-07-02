'use server';

import { collection, doc, getDoc, setDoc, query, orderBy, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { type HomepageStats, type Offering } from '@/types';

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

const defaultOfferings: Omit<Offering, 'id'>[] = [
  {
    title: 'Web Development',
    description: 'Building modern, responsive, and scalable web applications tailored to your business needs.',
    icon: 'Code',
    order: 1,
  },
  {
    title: 'Mobile Development',
    description: 'Creating high-performance native and cross-platform mobile apps for iOS and Android.',
    icon: 'Smartphone',
    order: 2,
  },
  {
    title: 'AI/ML Solutions',
    description: 'Integrating intelligent algorithms and machine learning models to unlock data-driven insights.',
    icon: 'BrainCircuit',
    order: 3,
  },
   {
    title: 'EdTech Platforms',
    description: 'Developing innovative educational technology to enhance learning experiences and outcomes.',
    icon: 'GraduationCap',
    order: 4,
  },
];

export async function getOfferings(): Promise<Offering[]> {
  if (!db) {
    console.warn('Firestore is not initialized. Serving default offerings.');
    return defaultOfferings.map((o, i) => ({ ...o, id: `default-${i}` }));
  }

  try {
    const offeringsCol = collection(db, 'offerings');
    const q = query(offeringsCol, orderBy('order'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No offerings found, seeding with default data.');
      for (const offering of defaultOfferings) {
        await addDoc(collection(db, 'offerings'), offering);
      }
      const seededSnapshot = await getDocs(q);
      return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offering));
    }

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offering));
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return defaultOfferings.map((o, i) => ({ ...o, id: `default-${i}` }));
  }
}

export async function addOffering(offering: Omit<Offering, 'id'>): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firestore is not initialized.' };
    try {
        await addDoc(collection(db, 'offerings'), offering);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Offering added successfully.' };
    } catch (error) {
        console.error('Error adding offering:', error);
        return { success: false, message: 'Failed to add offering.' };
    }
}

export async function updateOffering(id: string, offering: Partial<Omit<Offering, 'id'>>): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firestore is not initialized.' };
    try {
        const docRef = doc(db, 'offerings', id);
        await setDoc(docRef, offering, { merge: true });
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Offering updated successfully.' };
    } catch (error) {
        console.error('Error updating offering:', error);
        return { success: false, message: 'Failed to update offering.' };
    }
}

export async function deleteOffering(id: string): Promise<{ success: boolean; message: string }> {
    if (!db) return { success: false, message: 'Firestore is not initialized.' };
    try {
        const docRef = doc(db, 'offerings', id);
        await deleteDoc(docRef);
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Offering deleted successfully.' };
    } catch (error) {
        console.error('Error deleting offering:', error);
        return { success: false, message: 'Failed to delete offering.' };
    }
}
