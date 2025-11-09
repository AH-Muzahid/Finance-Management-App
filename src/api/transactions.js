// API functions for transaction operations

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const saveTransaction = async (transactionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save transaction');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving transaction:', error);
        throw error;
    }
};

export const getTransactions = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/${userId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const deleteTransaction = async (transactionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete transaction');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};