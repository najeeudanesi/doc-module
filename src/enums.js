const EnumOptions = {
    DeliveryType: [
      { label: "Normal", value: 1 },
      { label: "CS", value: 2 },
    ],
  
    FamilyPlanMethod: [
      { label: "IUCD", value: 1 },
      { label: "Pills", value: 2 },
      { label: "Implants", value: 3 },
      { label: "Injectable Two Months", value: 4 },
      { label: "Injectable Three Months", value: 5 },
    ],
  
    Investigation: [
      { label: "FBC", value: 1 },
      { label: "PT", value: 2 },
      { label: "LFT", value: 3 },
      { label: "EUC", value: 4 },
      { label: "RBS", value: 5 },
    ],
  
    Color: [
      { label: "Red", value: 1 },
      { label: "Green", value: 2 },
      { label: "Blue", value: 3 },
      { label: "Yellow", value: 4 },
      { label: "Orange", value: 5 },
      { label: "Purple", value: 6 },
      { label: "Pink", value: 7 },
      { label: "Brown", value: 8 },
      { label: "Black", value: 9 },
      { label: "White", value: 10 },
    ],
  
    MuscleTone: [
      { label: "Hypotonia", value: 1 },
      { label: "Hypertonia", value: 2 },
      { label: "Normal", value: 3 },
      { label: "Flaccid", value: 4 },
      { label: "Rigidity", value: 5 },
      { label: "Spasticity", value: 6 },
      { label: "Dystonia", value: 7 },
      { label: "Ataxia", value: 8 },
    ],
  
    Reflex: [
      { label: "Rooting", value: 1 },
      { label: "Sucking", value: 2 },
      { label: "Grasping", value: 3 },
      { label: "Moro", value: 4 },
      { label: "Tonic Neck", value: 5 },
      { label: "Stepping", value: 6 },
      { label: "Babinski", value: 7 },
      { label: "Galant", value: 8 },
      { label: "Placing", value: 9 },
      { label: "Crawling", value: 10 },
    ],
  
    RespiratoryEffect: [
      { label: "Respiratory Distress Syndrome", value: 1 },
      { label: "Bronchiolitis", value: 2 },
      { label: "Pneumonia", value: 3 },
      { label: "Apnea of Prematurity", value: 4 },
      { label: "Transient Tachypnea of the Newborn", value: 5 },
      { label: "Croup", value: 6 },
    ],
  
    MenstrualFlow: [
      { label: "Regular", value: 1 },
      { label: "Irregular", value: 2 },
    ],
  
    PainType: [
      { label: "Constant", value: 1 },
      { label: "Intermittent", value: 2 },
    ],
  
    SymptomStatus: [
      { label: "Constant", value: 1 },
      { label: "Intermittent", value: 2 },
    ],
  };
  
  export default EnumOptions;
  