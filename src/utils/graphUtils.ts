import type { Form } from '../types/form';

/**
 * Finds all direct dependencies of a form
 * @param forms Array of all forms
 * @param formId ID of the form to find dependencies for
 * @returns Array of form IDs that are direct dependencies
 */
export const findDirectDependencies = (
  forms: Form[],
  formId: string
): string[] => {
  const form = forms.find(f => f.id === formId);
  if (!form) return [];
  
  return form.dependencies;
};

/**
 * Finds all transitive dependencies of a form (dependencies of dependencies)
 * @param forms Array of all forms
 * @param formId ID of the form to find dependencies for
 * @param visited Set to track visited forms (prevents cycles)
 * @returns Array of form IDs that are transitive dependencies
 */
export const findTransitiveDependencies = (
  forms: Form[],
  formId: string,
  visited = new Set<string>()
): string[] => {
  const form = forms.find(f => f.id === formId);
  if (!form) return [];

  const dependencies = new Set<string>();
  
  const traverse = (currentFormId: string) => {
    if (visited.has(currentFormId)) return;
    visited.add(currentFormId);

    const currentForm = forms.find(f => f.id === currentFormId);
    if (!currentForm) return;

    currentForm.dependencies.forEach(depId => {
      dependencies.add(depId);
      traverse(depId);
    });
  };

  traverse(formId);
  return Array.from(dependencies);
};

/**
 * Gets all available data sources for a form (direct and transitive dependencies)
 * @param forms Array of all forms
 * @param formId ID of the form to get data sources for
 * @returns Object containing direct and transitive dependencies with their fields
 */
export const getFormDataSources = (
  forms: Form[],
  formId: string
): {
  direct: Array<{ formId: string; fieldId: string }>;
  transitive: Array<{ formId: string; fieldId: string }>;
} => {
  const directDeps = findDirectDependencies(forms, formId);
  const transitiveDeps = findTransitiveDependencies(forms, formId);

  return {
    direct: directDeps.flatMap(depId => {
      const depForm = forms.find(f => f.id === depId);
      return depForm?.fields.map(field => ({
        formId: depId,
        fieldId: field.id
      })) || [];
    }),
    transitive: transitiveDeps.flatMap(depId => {
      const depForm = forms.find(f => f.id === depId);
      return depForm?.fields.map(field => ({
        formId: depId,
        fieldId: field.id
      })) || [];
    })
  };
};