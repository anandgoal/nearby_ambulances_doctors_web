import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Record } from '../types/index'

const Ambulance: React.FC = () => {
    const [ambulances, setAmbulances] = useState<Record[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalAmbulances, setTotalAmbulances] = useState<number>(0);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentRecord, setCurrentRecord] = useState<Record | null>(null);
  
    const itemsPerPage = 10;
    // Fetch data for ambulances
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const ambulanceResponse = await axios.get(`http://localhost:5000/api/ambulances/list?page=${currentPage}&limit=${itemsPerPage}`);
        setAmbulances(ambulanceResponse.data.data);
        setTotalAmbulances(ambulanceResponse.data.totalRecords);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
  
    // Call fetch data on component mount and page change
    useEffect(() => {
      fetchData();
    }, [currentPage]);
  
    // Handle page change
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
  
    // Handle Add/Edit form submission
    const handleSubmit = async (newRecord: Record) => {
        if (isEditing && currentRecord) {
        // Update the record
        await axios.put(`http://localhost:5000/api/ambulances/edit/${currentRecord.id}`, newRecord);
        setAmbulances(ambulances.map(item => item.id === newRecord.id ? newRecord : item));
      } else {
        // Add the new record
        await axios.post(`http://localhost:5000/api/ambulances/add`, newRecord);
        setAmbulances([newRecord, ...ambulances]);
      }
      setIsEditing(false);
      setCurrentRecord(null);
    };

  
    // Handle Delete operation
    const handleDelete = async (id: any) => {
      try {
        await axios.delete(`http://localhost:5000/api/ambulances/delete/${id}`);
          setAmbulances(ambulances.filter((doctor) => doctor.id !== id));
          setTotalAmbulances(totalAmbulances - 1);
      } catch (err) {
        setError('Failed to delete record');
      }
    };
  
    // Handle Edit operation
    const handleEdit = (record: Record) => {
      setIsEditing(true);
      setCurrentRecord(record);
    };
  
    // Add or Edit form component
    const RenderForm = () => {
      const [formData, setFormData] = useState<Record>({
        id: currentRecord?.id || 0,
        title: currentRecord?.title || '',
        description: currentRecord?.description || '',
        location: currentRecord?.location || '',
        image: currentRecord?.image || null,
      });
  
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
  
      return (
        <div className="container">
            <div className="right">
            <h3>{currentRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
                <label htmlFor="title">Title</label>
                <input type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Title"
                    onChange={handleChange}
                    required />

                <label htmlFor="description">description</label>
                <input type="text"
                    name="description"
                    value={formData.description}
                    placeholder="Description"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="location">location</label>
                <input type="text"
                    name="location"
                    value={formData.location}
                    placeholder="Location"
                    onChange={handleChange}
                    required />

                <label htmlFor="message">Message</label>
                <input     
                type="url"
                name="image"
                value={formData.image || ''}
                placeholder="Image URL (Optional)"
                onChange={handleChange} />

                <button type="submit" className='button'>{currentRecord ? 'Update' : 'Add'} Record</button>
                </form>
            </div>
        </div>
       );
    };
  
    return (
      <div>
        {/* <div className='d-flex heading'></div> */}
        
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
  
        <div>
          <h2>Total Ambulances: {totalAmbulances}</h2>
        </div>
  
        <div>
          <h3>Ambulances List</h3>
          {ambulances.length === 0 ? (
            <div>No Ambulances Found</div>
          ) : (
            <div>
                <div className="grid-container">
                {ambulances.map((ambulance) => (
                <div className="grid-item" key={ambulance.id}>
                    
                    <div className='d-flex'>
                        <div>
                            {ambulance.image && <img src={ambulance.image} alt="ambulance" />}
                        </div>
                        <div><h4>{ambulance.title}</h4>
                            <p>{ambulance.description}</p>
                        </div>
                    </div>
                    <div className='d-flex'> 
                        <p>{ambulance.location}</p>
                    </div>
                    <div className='d-flex'>
                        <button className='button' onClick={() => handleEdit(ambulance)}>Edit</button>
                        <button className='button' onClick={() => handleDelete(ambulance.id)}>Delete</button>
                    </div>
                </div>
            ))}

                </div>
            </div>
          )}
        </div>
  
        <div>
          <button className='button' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <button className='button' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * itemsPerPage >= totalAmbulances}>
            Next
          </button>
        </div>
  
        {isEditing && <RenderForm />}
        {!isEditing && <div><button className='button' onClick={() => setIsEditing(true)}>Add New Record</button></div>}
      </div>
    );
  };
  
  export default Ambulance;
