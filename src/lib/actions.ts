'use server';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { type HomepageStats } from '@/types';

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
    return { success: true, message: 'Homepage stats updated successfully.' };
  } catch (error) {
    console.error('Error updating stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update stats: ${errorMessage}` };
  }
}
