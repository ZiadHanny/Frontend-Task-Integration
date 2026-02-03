export interface Customer {
  id: string;
  name: string;
  contacts: number;
  createdAt: string;
  modifiedAt: string;
}

export const customers: Customer[] = [
  {
    id: "1",
    name: "Acme Corporation",
    contacts: 12,
    createdAt: "Jan 5, 2025",
    modifiedAt: "Jan 20, 2025",
  },
  {
    id: "2",
    name: "TechStart Inc.",
    contacts: 5,
    createdAt: "Dec 12, 2024",
    modifiedAt: "Jan 18, 2025",
  },
  {
    id: "3",
    name: "Global Solutions Ltd.",
    contacts: 34,
    createdAt: "Jan 10, 2025",
    modifiedAt: "Jan 25, 2025",
  },
  {
    id: "4",
    name: "Sunrise Retail",
    contacts: 8,
    createdAt: "Nov 22, 2024",
    modifiedAt: "Jan 15, 2025",
  },
  {
    id: "5",
    name: "NextGen Media",
    contacts: 21,
    createdAt: "Jan 8, 2025",
    modifiedAt: "Jan 24, 2025",
  },
  {
    id: "6",
    name: "CloudNine Services",
    contacts: 17,
    createdAt: "Jan 14, 2025",
    modifiedAt: "Jan 26, 2025",
  },
  {
    id: "7",
    name: "Pioneer Healthcare",
    contacts: 3,
    createdAt: "Dec 28, 2024",
    modifiedAt: "Jan 19, 2025",
  },
  {
    id: "8",
    name: "BlueWave Logistics",
    contacts: 9,
    createdAt: "Jan 2, 2025",
    modifiedAt: "Jan 22, 2025",
  },
];
