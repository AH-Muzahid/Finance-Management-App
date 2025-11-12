// API functions for transaction operations

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const saveTransaction = async (transactionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/add-transaction`, {
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

export const getTransactions = async (email, sortBy = 'date', sortOrder = 'desc') => {
    try {
        const response = await fetch(`${API_BASE_URL}/my-transactions?email=${email}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const getTransaction = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transaction/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch transaction');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
    }
};

export const updateTransaction = async (id, transactionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transaction/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update transaction');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
};

export const deleteTransaction = async (transactionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transaction/${transactionId}`, {
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

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};