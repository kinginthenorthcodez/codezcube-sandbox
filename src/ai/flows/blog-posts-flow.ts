'use server';
/**
 * @fileOverview A flow for generating blog post content.
 *
 * - generateBlogPosts - A function that generates a list of blog posts on a given topic.
 * - BlogPostInput - The input type for the generateBlogPosts function.
 * - BlogPostOutput - The return type for the generateBlogPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const BlogPostInputSchema = z.object({
  topic: z.string().describe('The central topic for the blog posts.'),
});
export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

const BlogPostSchema = z.object({
  title: z.string().describe('The catchy and informative title of the blog post.'),
  author: z.string().describe("The name of the author, like 'John D.'."),
  date: z.string().describe("The publication date in 'Month Day, Year' format."),
  category: z.string().describe('The primary category of the blog post (e.g., AI/ML, Web Development, Tech in Africa).'),
  image: z.string().describe("A placeholder image URL (600x400) from placehold.co."),
  hint: z.string().describe("A two-word hint for generating an image for the post, like 'artificial intelligence'."),
  excerpt: z.string().describe('A short, compelling one-sentence summary of the post.'),
});

const BlogPostOutputSchema = z.object({
  posts: z.array(BlogPostSchema).min(3).max(3).describe('An array of exactly 3 blog posts.'),
});
export type BlogPostOutput = z.infer<typeof BlogPostOutputSchema>;

export async function generateBlogPosts(input: BlogPostInput): Promise<BlogPostOutput> {
  return generateBlogPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'blogPostPrompt',
  input: {schema: BlogPostInputSchema},
  output: {schema: BlogPostOutputSchema},
  prompt: `You are a content creator for CodezCube, a tech company specializing in web development, AI/ML, and EdTech, with a focus on innovation in Africa.

Generate 3 diverse and engaging blog post summaries based on the following topic: {{{topic}}}.

For each post, provide all the required fields. The author should be a name with an initial for the last name. The image must be a https://placehold.co/600x400.png placeholder. The date should be recent.
`,
});

const generateBlogPostsFlow = ai.defineFlow(
  {
    name: 'generateBlogPostsFlow',
    inputSchema: BlogPostInputSchema,
    outputSchema: BlogPostOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
