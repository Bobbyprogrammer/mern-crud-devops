import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { UserPlus, Pencil, Trash2, Users, Save } from 'lucide-react';

function App() {
  const API = import.meta.env.VITE_API_URL;
  console.log('API URL:', API);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(API);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch user', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      return toast.warning('All fields are required');
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);

        toast.success('User updated successfully');
      } else {
        await axios.post(API, formData);

        toast.success('User created successfully');
      }

      setFormData({
        name: '',
        email: '',
      });

      setEditingId(null);

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);

    setFormData({
      name: user.name,
      email: user.email,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete?');

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`);

      toast.success('User deleted successfully');

      fetchUsers();
    } catch (error) {
      toast.error('Delete failed', error);
    }
  };

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'Arial',
      }}
    >
      <ToastContainer />

      <h1
        style={{
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        <Users size={30} />
        &nbsp; MERN CRUD APPLICATIONS
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '30px',
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          style={{
            padding: '12px',
            fontSize: '16px',
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          style={{
            padding: '12px',
            fontSize: '16px',
          }}
        />

        <button
          type="submit"
          style={{
            padding: '12px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {editingId ? (
            <>
              <Save size={18} />
              &nbsp; Update User
            </>
          ) : (
            <>
              <UserPlus size={18} />
              &nbsp; Create User
            </>
          )}
        </button>
      </form>

      <table
        border="1"
        width="100%"
        cellPadding="10"
        style={{
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      marginRight: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                style={{
                  textAlign: 'center',
                }}
              >
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
