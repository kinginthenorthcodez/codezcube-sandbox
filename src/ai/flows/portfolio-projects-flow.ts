'use server';
/**
 * @fileOverview A flow for generating portfolio project content.
 *
 * - generateProjects - A function that generates a list of portfolio projects.
 * - ProjectInput - The input type for the generateProjects function.
 * - ProjectOutput - The return type for the generateProjects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ProjectInputSchema = z.object({
  topic: z.string().describe('The central topic for the portfolio projects, e.g., "Technology in Africa".'),
});
export type ProjectInput = z.infer<typeof ProjectInputSchema>;

const ProjectSchema = z.object({
  title: z.string().describe('The title of the project.'),
  description: z.string().describe('A brief, engaging description of the project.'),
  category: z.string().describe('The primary category of the project (e.g., Web Development, Mobile Development, AI/ML, EdTech).'),
  image: z.string().describe("A placeholder image URL (600x400) from placehold.co."),
  hint: z.string().describe("A two-word hint for generating an image for the project, like 'online store'."),
});

const ProjectOutputSchema = z.object({
  projects: z.array(ProjectSchema).min(6).max(6).describe('An array of exactly 6 portfolio projects.'),
});
export type ProjectOutput = z.infer<typeof ProjectOutputSchema>;

export async function generateProjects(input: ProjectInput): Promise<ProjectOutput> {
  return generateProjectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'portfolioProjectPrompt',
  input: {schema: ProjectInputSchema},
  output: {schema: ProjectOutputSchema},
  prompt: `You are a project manager for CodezCube, a tech company specializing in web development, AI/ML, and EdTech, with a focus on innovation in Africa.

Generate 6 diverse and compelling portfolio project summaries based on the following topic: {{{topic}}}.

Ensure a mix of categories: Web Development, Mobile Development, AI/ML, and EdTech.
For each project, provide all the required fields. The image must be a https://placehold.co/600x400.png placeholder.
`,
});

const generateProjectsFlow = ai.defineFlow(
  {
    name: 'generateProjectsFlow',
    inputSchema: ProjectInputSchema,
    outputSchema: ProjectOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
