/**
 * Project Routes
 * 
 * Handles project management: list, create, switch, delete, rename, duplicate.
 */

import { Hono } from 'hono';
import type { ProjectConfig } from '../types/index.ts';
import {
  listProjects,
  createProject,
  deleteProject,
  renameProject,
  duplicateProject,
} from '../projects.ts';

export interface ProjectState {
  currentProjectId: string;
  currentConfig: ProjectConfig | null;
}

export function createProjectRoutes(
  getState: () => ProjectState,
  setState: (updates: Partial<ProjectState>) => void,
  getConfig: () => Promise<ProjectConfig>
) {
  const routes = new Hono();

  /**
   * List all projects
   */
  routes.get('/', async (c) => {
    const projects = await listProjects();
    return c.json({ projects, currentProjectId: getState().currentProjectId });
  });

  /**
   * Get current project
   */
  routes.get('/current', async (c) => {
    const config = await getConfig();
    return c.json({ projectId: getState().currentProjectId, config });
  });

  /**
   * Create new project
   */
  routes.post('/', async (c) => {
    const { name } = await c.req.json();
    const project = await createProject(name);
    return c.json(project);
  });

  /**
   * Switch to a project
   */
  routes.put('/:id/activate', async (c) => {
    const { id } = c.req.param();
    setState({ currentProjectId: id, currentConfig: null });
    const config = await getConfig();
    return c.json({ projectId: id, config });
  });

  /**
   * Delete a project
   */
  routes.delete('/:id', async (c) => {
    const { id } = c.req.param();
    await deleteProject(id);
    
    // If deleted current project, switch to default
    if (id === getState().currentProjectId) {
      setState({ currentProjectId: 'default', currentConfig: null });
    }
    
    return c.json({ success: true });
  });

  /**
   * Rename a project
   */
  routes.patch('/:id', async (c) => {
    const { id } = c.req.param();
    const { name } = await c.req.json();
    const project = await renameProject(id, name);
    
    // If renamed current project, reload config
    if (id === getState().currentProjectId) {
      setState({ currentConfig: null });
    }
    
    return c.json(project);
  });

  /**
   * Duplicate a project
   */
  routes.post('/:id/duplicate', async (c) => {
    const { id } = c.req.param();
    const { name } = await c.req.json();
    const project = await duplicateProject(id, name);
    return c.json(project);
  });

  return routes;
}
