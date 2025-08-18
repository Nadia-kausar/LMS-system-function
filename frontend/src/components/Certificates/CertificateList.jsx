import { useEffect, useState } from 'react';
import API from '../../api/api';

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    API.get('certificates/')
      .then(res => setCertificates(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>My Certificates</h2>
      {certificates.map(c => (
        <div key={c.id}>
          <p>Course: {c.course.title}</p>
          <p>Issued at: {new Date(c.issued_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CertificateList;
