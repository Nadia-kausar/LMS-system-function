import { createContext, useState } from 'react';

export const EnrollmentContext = createContext();

export const EnrollmentProvider = ({ children }) => {
  const [enrollments, setEnrollments] = useState([]);

  return (
    <EnrollmentContext.Provider value={{ enrollments, setEnrollments }}>
      {children}
    </EnrollmentContext.Provider>
  );
};
