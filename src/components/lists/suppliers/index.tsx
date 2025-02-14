import React from 'react';

interface Supplier {
  id: string;
  name: string;
  // Add other supplier properties here
}

interface SuppliersProps {
  data: Supplier[];
}

const Suppliers: React.FC<SuppliersProps> = ({ data }) => {
  return (
    <div>
      {/* Render suppliers data */}
      {data && data.map((supplier) => (
        <div key={supplier.id}>{supplier.name}</div>
      ))}
    </div>
  );
};

export default Suppliers;
