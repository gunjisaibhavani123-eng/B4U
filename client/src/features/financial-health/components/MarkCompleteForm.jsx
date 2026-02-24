import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import { useUpdateChecklistItemMutation } from '../services/checklistApi';

export default function MarkCompleteForm({ itemType, fields = [] }) {
  const navigate = useNavigate();
  const [updateItem, { isLoading }] = useUpdateChecklistItemMutation();
  const [values, setValues] = useState({});

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateItem({
        itemType,
        completed: true,
        details: values,
      }).unwrap();
      message.success('Marked as complete!');
      navigate(-1);
    } catch {
      message.error('Failed to update');
    }
  };

  return (
    <div className="space-y-4 border-t border-gray-100 pt-4">
      <h3 className="text-sm font-semibold text-gray-900">Mark as Done</h3>

      {fields.map((field) => (
        <div key={field.name}>
          <label className="text-sm text-gray-500 mb-1 block">{field.label}</label>
          <Input
            type={field.type === 'number' ? 'number' : 'text'}
            inputMode={field.type === 'number' ? 'numeric' : 'text'}
            prefix={field.prefix}
            placeholder={field.placeholder}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        </div>
      ))}

      <Button
        type="primary"
        size="large"
        block
        loading={isLoading}
        onClick={handleSubmit}
        className="h-12 rounded-xl font-semibold"
      >
        I've Done This ✓
      </Button>
    </div>
  );
}
