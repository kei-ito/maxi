export const developMode = location.hostname === 'localhost';
export const APIBaseURL = new URL(developMode ? 'http://localhost:3000' : '');
