import React, { useState } from 'react'
import './DeliveryForm.css'

export default function DeliveryForm() {
  const [formData, setFormData] = useState({
    patientId: '',
    antenatalId: '',
    deliveryDate: '',
    deliveryTime: '',
    modeOfDelivery: '',
    deliveryBabyCry: '',
    apgarScore: '',
    sex: '',
    weight: '',
    durationOfLabour: '',
    placentaDelivery: {
      deliveryTime: '',
      deliveryMode: '',
      complete: false
    },
    anyPPH: false,
    episiotomyGiven: false,
    perineal: '',
    appointmentId: '',
    doctorId: '',
    nurseId: ''
  })

  const [entries, setEntries] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.startsWith('placentaDelivery.')) {
      const key = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        placentaDelivery: {
          ...prev.placentaDelivery,
          [key]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setEntries([...entries, formData])
    setFormData({
      patientId: '',
      antenatalId: '',
      deliveryDate: '',
      deliveryTime: '',
      modeOfDelivery: '',
      deliveryBabyCry: '',
      apgarScore: '',
      sex: '',
      weight: '',
      durationOfLabour: '',
      placentaDelivery: {
        deliveryTime: '',
        deliveryMode: '',
        complete: false
      },
      anyPPH: false,
      episiotomyGiven: false,
      perineal: '',
      appointmentId: '',
      doctorId: '',
      nurseId: ''
    })
  }

  return (
    <div className="container">
      <h2>Delivery Record Form</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid">
          {[
            'patientId',
            'antenatalId',
            'deliveryDate',
            'deliveryTime',
            'modeOfDelivery',
            'deliveryBabyCry',
            'apgarScore',
            'sex',
            'weight',
            'durationOfLabour',
            'perineal',
            'appointmentId',
            'doctorId',
            'nurseId'
          ].map((field) => (
            <div key={field} className="form-group">
              <label>{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Any PPH?</label>
            <input
              type="checkbox"
              name="anyPPH"
              checked={formData.anyPPH}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Episiotomy Given?</label>
            <input
              type="checkbox"
              name="episiotomyGiven"
              checked={formData.episiotomyGiven}
              onChange={handleChange}
            />
          </div>

          <h3>Placenta Delivery</h3>

          <div className="form-group">
            <label>Delivery Time</label>
            <input
              type="text"
              name="placentaDelivery.deliveryTime"
              value={formData.placentaDelivery.deliveryTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Delivery Mode</label>
            <input
              type="text"
              name="placentaDelivery.deliveryMode"
              value={formData.placentaDelivery.deliveryMode}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Complete?</label>
            <input
              type="checkbox"
              name="placentaDelivery.complete"
              checked={formData.placentaDelivery.complete}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Add Record</button>
      </form>

      <h3>Entries</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            {Object.keys(formData).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {Object.keys(formData).map((key) => (
                <td key={key}>
                  {typeof entry[key] === 'object'
                    ? JSON.stringify(entry[key])
                    : String(entry[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
