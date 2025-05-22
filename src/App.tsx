import { useState } from 'react'
import { FormList } from './components/FormList'
import { PrefillConfig } from './components/PrefillConfig'
import { useFormPrefill } from './hooks/useFormPrefill'
import type { Form } from './types/form'
import './App.css'

function App() {
  const {
    forms,
    loading,
    error,
    getFormPrefillConfig,
    addPrefillMapping,
    removePrefillMapping,
    getAvailableDataSources
  } = useFormPrefill()

  const [selectedForm, setSelectedForm] = useState<Form | null>(null)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="app">
      <header>
        <h1>Form Prefill Configuration</h1>
      </header>
      <main>
        <div className="content">
          <FormList
            forms={forms}
            onFormSelect={setSelectedForm}
          />
          {selectedForm && (
            <PrefillConfig
              form={selectedForm}
              mappings={getFormPrefillConfig(selectedForm.id).mappings}
              availableDataSources={getAvailableDataSources(selectedForm.id)}
              onAddMapping={(mapping) => addPrefillMapping(selectedForm.id, mapping)}
              onRemoveMapping={(targetFieldId) => removePrefillMapping(selectedForm.id, targetFieldId)}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
