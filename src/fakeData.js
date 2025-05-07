export const personalInfo = {
  birthName: 'John Alexander Doe',
  usedName: 'John Doe',
  firstNames: 'John Alexander',
  dateOfBirth: '1980-05-15',
  placeOfBirth: 'New York, NY',
  status: 'Citizen',
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'USA',
  phone: '555-0123',
  email: 'john.doe@example.com',
  annualIncome: 120000,
  netWorth: 750000,
  taxId: '123-45-6789',
  bankAccounts: [
    {
      accountName: "Compte 1",
      bankName: 'Banque Lumière',
      accountType: 'Compte courant',
      accountNumber: 'FR76 1234 5678 9123 4567 8901 234',
      approxBalance: "5 320.75",
    },
  ],
  maritalStatus: 'Married',
  spouse: {
    birthName: 'Jane Elizabeth Smith',
    usedName: 'Jane Doe',
    firstNames: 'Jane Elizabeth',
    dateOfBirth: '1982-07-22',
    placeOfBirth: 'Boston, MA',
    status: 'Citizen',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
    phone: '555-0124',
    email: 'jane.doe@example.com',
  },
  children: [
    {
      birthName: 'Emily Grace Doe',
      usedName: 'Emily Doe',
      firstNames: 'Emily Grace',
      dateOfBirth: '2010-03-10',
      placeOfBirth: 'New York, NY',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      phone: '555-0125',
      email: 'emily.doe@example.com',
    },
  ],
  nextOfKin: [
    {
      birthName: 'Robert Michael Doe',
      usedName: 'Robert Doe',
      firstNames: 'Robert Michael',
      dateOfBirth: '1955-11-30',
      placeOfBirth: 'Chicago, IL',
      relationship: 'Father',
      street: '456 Oak St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA',
      phone: '555-0126',
      email: 'robert.doe@example.com',
    },
  ],
};

export const assets = [
  { id: 1, name: 'Primary Home', category: 'Real Estate', value: 500000, documents: ['Deed.pdf'] },
  { id: 2, name: 'Stock Portfolio', category: 'Stocks', value: 100000, documents: [] },
  { id: 3, name: 'Farm (In Nakuru)', category: 'Real Estate', value: 200000, documents: [] },
];

export const debts = [
  { id: 1, name: 'Home Mortgage', category: 'Mortgage', amount: 300000 },
  { id: 2, name: 'Car Loan', category: 'Car Loan', amount: 20000 },
];

export const notifications = [
  { id: 1, message: 'New document uploaded', date: '2023-10-01' },
  { id: 2, message: 'Asset value updated', date: '2023-10-02' },
];

export const familyMembers = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', role: 'Editor' },
  { id: 2, name: 'John Smith', email: 'john@example.com', role: 'Viewer' },
];