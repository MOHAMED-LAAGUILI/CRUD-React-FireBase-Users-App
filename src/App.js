import React, { useState, useEffect, useCallback, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './App.css';

export default function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    job: '',
    address: '',
    birthdate: '',
    education: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef(null);
  
  const usersCollection = collection(db, 'users');
  
  const getUsers = useCallback(async () => {
    const data = await getDocs(usersCollection);
    setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  }, [usersCollection]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const createUser = async () => {
    if (newUser.name.trim() === '' || newUser.email.trim() === '') {
      Swal.fire('Error', 'Name and email are required', 'error');
      return;
    }
    await addDoc(usersCollection, newUser);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      gender: '',
      job: '',
      address: '',
      birthdate: '',
      education: ''
    });
    getUsers();
    Swal.fire('Success', 'User added successfully', 'success');
  };

  const updateUser = async (id, updatedUser) => {
    if (updatedUser.name.trim() === '' || updatedUser.email.trim() === '') {
      Swal.fire('Error', 'Name and email are required', 'error');
      return;
    }
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, updatedUser);
    getUsers();
    Swal.fire('Success', 'User updated successfully', 'success');
  };

  const deleteUser = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const userDoc = doc(db, 'users', id);
        await deleteDoc(userDoc);
        getUsers();
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      }
    });
  };

  const handleEditChange = (field, value) => {
    setEditingUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center neumorphic">User Management System</h1>
      
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card mb-4 neumorphic">
            <div className="card-body">
              <h5 className="card-title">Add New User</h5>
              <form>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control neumorphic"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control neumorphic"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="tel"
                    className="form-control neumorphic"
                    placeholder="Phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <select
                    className="form-select neumorphic"
                    value={newUser.gender}
                    onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control neumorphic"
                    placeholder="Job"
                    value={newUser.job}
                    onChange={(e) => setNewUser({ ...newUser, job: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control neumorphic"
                    placeholder="Address"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <input
                    type="date"
                    className="form-control neumorphic"
                    value={newUser.birthdate}
                    onChange={(e) => setNewUser({ ...newUser, birthdate: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control neumorphic"
                    placeholder="Education"
                    value={newUser.education}
                    onChange={(e) => setNewUser({ ...newUser, education: e.target.value })}
                  />
                </div>
                <button type="button" onClick={createUser} className="btn btn-primary neumorphic-btn">
                  <FontAwesomeIcon icon={faPlus} /> Add User
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          <h2 className="mb-3">User List</h2>
          <div className="input-group mb-3">
            <span className="input-group-text neumorphic"><FontAwesomeIcon icon={faSearch} /></span>
            <input
              type="text"
              className="form-control neumorphic"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-hover neumorphic">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Job</th>
                  <th>Address</th>
                  <th>Birthdate</th>
                  <th>Education</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(user => 
                    Object.values(user).some(value => 
                      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  )
                  .map(user => (
                    <tr key={user.id} className="fade-in">
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.gender}</td>
                      <td>{user.job}</td>
                      <td>{user.address}</td>
                      <td>{user.birthdate}</td>
                      <td>{user.education}</td>
                      <td>
                        <button onClick={() => setEditingUser({...user})} className="btn btn-warning btn-sm me-2 neumorphic-btn" data-bs-toggle="modal" data-bs-target="#editUserModal">
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                        <button onClick={() => deleteUser(user.id)} className="btn btn-danger btn-sm neumorphic-btn">
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editUserModal" tabIndex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content neumorphic">
            <div className="modal-header">
              <h5 className="modal-title" id="editUserModalLabel">Edit User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {editingUser && (
                <form>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control neumorphic"
                      placeholder="Name"
                      value={editingUser.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control neumorphic"
                      placeholder="Email"
                      value={editingUser.email}
                      onChange={(e) => handleEditChange('email', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      className="form-control neumorphic"
                      placeholder="Phone"
                      value={editingUser.phone}
                      onChange={(e) => handleEditChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select neumorphic"
                      value={editingUser.gender}
                      onChange={(e) => handleEditChange('gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control neumorphic"
                      placeholder="Job"
                      value={editingUser.job}
                      onChange={(e) => handleEditChange('job', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control neumorphic"
                      placeholder="Address"
                      value={editingUser.address}
                      onChange={(e) => handleEditChange('address', e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <input
                      type="date"
                      className="form-control neumorphic"
                      value={editingUser.birthdate}
                      onChange={(e) => handleEditChange('birthdate', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control neumorphic"
                      placeholder="Education"
                      value={editingUser.education}
                      onChange={(e) => handleEditChange('education', e.target.value)}
                    />
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary neumorphic-btn" data-bs-dismiss="modal">Cancel</button>
              <button type="button" onClick={() => {
                updateUser(editingUser.id, editingUser);
                setEditingUser(null);
              }} className="btn btn-primary neumorphic-btn" data-bs-dismiss="modal">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
