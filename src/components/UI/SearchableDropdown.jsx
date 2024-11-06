import { Edit2, X } from 'lucide-react';
import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Label from './Label';

const SearchableDropdown = ({onAddMedication}) => {
  const [availableMeds] = useState([
    'Paracetamol',
    'Flagyl',
    'Tetracycline',
    'Ibuprofen',
    'Amoxicillin',
    'Aspirin'
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [medicationDetails, setMedicationDetails] = useState({
    name: '',
    dosage: '',
    duration: '',
    frequency: ''
  });

  const filteredMeds = availableMeds.filter(med => 
    med.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setMedicationDetails({
      name: '',
      dosage: '',
      duration: '',
      frequency: ''
    });
    setEditingId(null);
    setSearchTerm('');
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    const { name, dosage, duration, frequency } = medicationDetails;
// console.log(selectedMeds)

    onAddMedication(medicationDetails)
    //console.log(onAddMedication)
    if (name && dosage && duration && frequency) {
      if (editingId) {
        setSelectedMeds(selectedMeds.map(med => 
          med.id === editingId ? { ...medicationDetails, id: editingId } : med
        ));
      } else {
        setSelectedMeds([...selectedMeds, {
          ...medicationDetails,
          id: Date.now()
        }]);
      }
      resetForm();
    }
  };

  const handleEdit = (medication) => {
    setMedicationDetails({
      name: medication.name,
      dosage: medication.dosage,
      duration: medication.duration,
      frequency: medication.frequency
    });
    setEditingId(medication.id);
  };

  const removeMedication = (id) => {
    setSelectedMeds(selectedMeds.filter(med => med.id !== id));
  };

  return (
    <div className="space-y-6">
      {selectedMeds.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Selected Medications</h3>
          <div className="selected-list">
            {selectedMeds.map((med) => (
              <div 
                key={med.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  editingId === med.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className='selected-item'>
                  <h4 className="font-medium">{med.name}</h4>
                  <p className="text-sm text-gray-500">
                    Dosage: {med.dosage}mg | Duration: {med.duration} days | 
                    Frequency: {med.frequency}x daily
                  </p>
                </div>
                <div className="selected-button">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleEdit(med)}
                  >
                    <Edit2 className="h-4 w-4 " />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => removeMedication(med.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-4">
          {editingId ? 'Edit Medication' : 'Add New Medication'}
        </h3>

        {!editingId && (
          <div className="relative mb-4">
            <Label htmlFor="search">Search Medication</Label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                className="medicationSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
                <div className="py-1">
                  {filteredMeds.map((med) => (
                    <div
                      key={med}
                      className="hoverLink px-4 py-2 hover:bg-gray-100 cursor-pointer "
                      onClick={() => {
                        setMedicationDetails({
                          ...medicationDetails,
                          name: med
                        });
                        setSearchTerm('');
                      }}
                    >
                      {med}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleAddMedication} className="space-y-4">
          <div>
            <Label htmlFor="selected-med">Selected Medication</Label>
            <Input
              id="selected-med"
              value={medicationDetails.name}
              onChange={(e) => setMedicationDetails({
                ...medicationDetails,
                name: e.target.value
              })}
              placeholder="Select a medication from search"
              readOnly={!editingId}
            />
          </div>

          <div className="form-3">
            <div >
              <Label htmlFor="dosage" className='labelDrop'>Dosage (mg)</Label>
              <Input
                id="dosage"
                type="number"
                value={medicationDetails.dosage}
                onChange={(e) => setMedicationDetails({
                  ...medicationDetails,
                  dosage: e.target.value
                })}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={medicationDetails.duration}
                onChange={(e) => setMedicationDetails({
                  ...medicationDetails,
                  duration: e.target.value
                })}
              />
            </div>

            <div>
              <Label htmlFor="frequency">Frequency/day</Label>
              <Input
                id="frequency"
                type="number"
                value={medicationDetails.frequency}
                onChange={(e) => setMedicationDetails({
                  ...medicationDetails,
                  frequency: e.target.value
                })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 "
              disabled={!medicationDetails.name}
            >
              {editingId ? 'Update Medication' : 'Add Medication'}
            </Button>
            {editingId && (
              <Button 
                type="button" 
                variant="outline"
                onClick={resetForm}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchableDropdown;
