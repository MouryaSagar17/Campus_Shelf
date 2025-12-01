export const branches = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    short: "CSE",
    description: "Core CS fundamentals, algorithms, data structures, operating systems and more.",
    books: [
      {
        id: "cse-1",
        title: "Data Structures & Algorithms Essentials",
        author: "CampusShelf Editorial",
        level: "2nd Year",
        description: "Core concepts of arrays, linked lists, trees, graphs and algorithm techniques.",
        content: `
Chapter 1: Time & Space Complexity
- Big-O, Big-Omega, Big-Theta
- Analysing loops and recurrences

Chapter 2: Arrays & Linked Lists
- Static vs dynamic arrays
- Singly, doubly & circular lists

Chapter 3: Stacks & Queues
- Implementation using arrays & lists
- Applications in parsing and BFS
        `,
      },
      {
        id: "cse-2",
        title: "Operating Systems Basics",
        author: "CampusShelf Editorial",
        level: "3rd Year",
        description: "Processes, threads, scheduling, deadlocks and memory management.",
        content: `
Unit 1: Process Management
- Process states & PCB
- Context switching

Unit 2: CPU Scheduling
- FCFS, SJF, Priority, Round Robin
- Multilevel queues
        `,
      },
    ],
  },
  {
    id: "ece",
    name: "Electronics & Communication Engineering",
    short: "ECE",
    description: "Signals, communication systems, digital electronics, VLSI and embedded systems.",
    books: [
      {
        id: "ece-1",
        title: "Digital Electronics Quick Notes",
        author: "CampusShelf Editorial",
        level: "2nd Year",
        description: "Boolean algebra, combinational and sequential circuit design.",
        content: `
Module 1: Number Systems & Codes
- Binary, Octal, Hex
- BCD, Gray code

Module 2: Boolean Algebra
- Postulates & theorems
- Karnaugh maps (K-maps)
        `,
      },
    ],
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    short: "ME",
    description: "Mechanics, thermodynamics, manufacturing processes and machine design.",
    books: [
      {
        id: "mech-1",
        title: "Engineering Mechanics – Short Notes",
        author: "CampusShelf Editorial",
        level: "1st Year",
        description: "Statics and dynamics concepts with solved examples.",
        content: `
Topic 1: Force Systems
- Resultant of coplanar forces
- Equilibrium conditions

Topic 2: Centroid & Moment of Inertia
- Centroid of simple shapes
- Parallel axis theorem
        `,
      },
    ],
  },
  {
    id: "civil",
    name: "Civil Engineering",
    short: "CE",
    description: "Structural analysis, concrete technology, surveying and transportation.",
    books: [
      {
        id: "civil-1",
        title: "Strength of Materials – Concepts",
        author: "CampusShelf Editorial",
        level: "2nd Year",
        description: "Stress, strain, bending and torsion basics.",
        content: `
Chapter 1: Simple Stress & Strain
- Hooke's law
- Elastic constants

Chapter 2: Bending Stresses
- Bending equation
- Section modulus
        `,
      },
    ],
  },
]


