// Format date for display
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Format date for input fields
export const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Get today's date
export const getTodayDate = (): string => {
    return formatDateForInput(new Date());
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Generate employee ID (for auto-generation)
export const generateEmployeeId = (): string => {
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EMP${timestamp}${random}`;
};