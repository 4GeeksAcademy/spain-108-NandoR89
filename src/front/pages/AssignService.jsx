import React, { useState } from 'react';


const AssignService = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [assignedDate, setAssignedDate] = useState(null);
  const [notes, setNotes] = useState('');

  const handleAssignDate = async () => {
    try {
      const response = await axios.post('/api/assign-date', { date: selectedDate });
      setAssignedDate(response.data.assignedDate);
      alert('Date assigned successfully');
    } catch (error) {
      alert('Error assigning date');
    }
  };

  const handleSave = () => {
    // Aquí se enviaría cliente, profesional, servicio, fecha y notas
    alert('Appointment saved successfully');
  };

  return (
    <div className="container mt-5 mb-5">
      <h3 className="text-center mb-4">Assign Service</h3>

      <div className="mb-3">
        <button className="btn btn-primary w-100 mb-2" data-bs-toggle="modal" data-bs-target="#clientModal">
          Select Client
        </button>
        <button className="btn btn-primary w-100 mb-2" data-bs-toggle="modal" data-bs-target="#notesModal">
          Notes
        </button>
        <button className="btn btn-primary w-100 mb-2" data-bs-toggle="modal" data-bs-target="#serviceModal">
          Select Service
        </button>
      </div>

      <div className="mb-3">
        <label htmlFor="dateInput" className="form-label">Date</label>
        <input
          type="date"
          className="form-control"
          id="dateInput"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button className="btn btn-outline-success mt-2 w-100" onClick={handleAssignDate}>
          Assign Date
        </button>
      </div>

      <div className="mt-4">
        <button className="btn btn-success w-100" onClick={handleSave}>
          Save Appointment
        </button>
      </div>

      {/* Client Modal */}
      <div className="modal fade" id="clientModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Select Client</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <ul className="list-group">
                <li className="list-group-item">Client 1</li>
                <li className="list-group-item">Client 2</li>
                <li className="list-group-item">Client 3</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      <div className="modal fade" id="notesModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Notes</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any notes or observations here"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Service Modal */}
      <div className="modal fade" id="serviceModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Select Service</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="service1" />
                <label className="form-check-label" htmlFor="service1">Corte de pelo Niño/a</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="service2" />
                <label className="form-check-label" htmlFor="service2">Corte de pelo Hombre</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="service3" />
                <label className="form-check-label" htmlFor="service3">Corte de pelo Mujer</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="service3" />
                <label className="form-check-label" htmlFor="service3">Tinte</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="service3" />
                <label className="form-check-label" htmlFor="service3">Permanente</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignService;
