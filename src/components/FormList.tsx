import type { Form } from '../types/form';

interface FormListProps {
  forms: Form[];
  onFormSelect: (form: Form) => void;
}

export const FormList = ({ forms, onFormSelect }: FormListProps) => {
  return (
    <div className="form-list">
      <h2>Forms</h2>
      <div className="forms">
        {forms.map(form => (
          <div
            key={form.id}
            className="form-item"
            onClick={() => onFormSelect(form)}
          >
            <h3>{form.name}</h3>
            <p>{form.fields.length} fields</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 