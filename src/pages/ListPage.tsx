import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VirtualizedList from '../components/VirtualizedList';
import { Employee } from '../types';

const ListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://backend.jotish.in/backend_dev/gettabledata.php',
          { username: 'test', password: '123456' }
        );
        
        // Transform API data to match our Employee type
        // Adjust based on actual API response structure
        const transformedData = response.data.map((item: any, index: number) => ({
          id: item.id || index + 1,
          name: item.name || `Employee ${index + 1}`,
          position: item.position || 'Developer',
          salary: item.salary || Math.floor(Math.random() * 100000) + 50000,
          city: item.city || 'New York'
        }));
        
        setEmployees(transformedData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-4 gap-4 mb-4 px-4 font-semibold text-gray-700">
            <div>Name</div>
            <div>Position</div>
            <div>Salary</div>
            <div>City</div>
          </div>
          
          {employees.length > 0 ? (
            <VirtualizedList data={employees} rowHeight={50} buffer={5} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No employees found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPage;
