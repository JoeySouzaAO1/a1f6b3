import type { Form } from '../types/form';

interface FormListProps {
  forms: Form[];
  selectedFormId: string | null;
  onSelectForm: (formId: string) => void;
}

export const FormList = ({ forms, selectedFormId, onSelectForm }: FormListProps) => {
  return (
    <div className="form-list">
      <h2>Forms</h2>
      <ul>
        {forms.map(form => (
          <li key={form.id}>
            <button
              onClick={() => onSelectForm(form.id)}
              className={selectedFormId === form.id ? 'selected' : ''}
            >
              {form.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}; 