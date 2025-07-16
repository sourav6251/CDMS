class SampleData {
    meeting = [
        {
            _id: "64bdfd1e16f2b21f1a9c1111",
            user: {
                _id: "64bdfd1e16f2b21f1a9c0001",
                name: "Dr. Neha Sharma",
                email: "neha.sharma@college.edu",
                role: "faculty",
            },
            title: "Academic Calendar Discussion",
            description:
                "Meeting to finalize the upcoming semester’s calendar.",
            meetingTime: "2025-07-13T10:00:00Z",
            joinusList: [
                {
                    _id: "64bdfd1e16f2b21f1a9c0002",
                    name: "Ravi Kumar",
                    email: "ravi.kumar@student.com",
                    role: "student",
                },
                {
                    _id: "64bdfd1e16f2b21f1a9c0003",
                    name: "Guest Lecturer",
                    email: "guest@external.org",
                    phoneNo: "+918888888888",
                },
            ],
            joinusModel: ["user", "normaluser"],
            meetingArea: "Room 301, Admin Block",
            createdAt: "2025-07-01T12:00:00Z",
            updatedAt: "2025-07-01T12:00:00Z",
        },
        {
            _id: "64be001e16f2b21f1a9c2222",
            user: {
                _id: "64bdfd1e16f2b21f1a9c0101",
                name: "Prof. Meena Patil",
                email: "meena.patil@dept.edu",
                role: "hod",
            },
            title: "Lab Equipment Planning",
            description:
                "Discussion on procurement of lab equipment for next semester.",
            meetingTime: "2025-07-13T14:30:00Z",
            joinusList: [
                {
                    _id: "64bdfd1e16f2b21f1a9c0202",
                    name: "Technical Assistant",
                    email: "tech@support.com",
                    phoneNo: "+919999999999",
                },
            ],
            joinusModel: ["normaluser"],
            meetingArea: "Laboratory Conference Room",
            createdAt: "2025-07-02T09:00:00Z",
            updatedAt: "2025-07-02T09:00:00Z",
        },
        {
            _id: "64be111e16f2b21f1a9c3333",
            user: {
                _id: "64bdfd1e16f2b21f1a9c0303",
                name: "Admin Office",
                email: "admin@college.edu",
                role: "admin",
            },
            title: "Annual Day Preparation",
            description: "Initial planning session for the annual function.",
            meetingTime: "2025-07-25T17:00:00Z",
            joinusList: [
                {
                    _id: "64bdfd1e16f2b21f1a9c0404",
                    name: "Cultural Committee",
                    email: "culture@college.edu",
                    role: "faculty",
                },
            ],
            joinusModel: ["user"],
            meetingArea: "Auditorium Main Hall",
            createdAt: "2025-07-04T08:30:00Z",
            updatedAt: "2025-07-04T08:30:00Z",
        },
        {
            _id: "64be121e16f2b21f1a9c4444",
            user: {
                _id: "64bdfd1e16f2b21f1a9c0505",
                name: "Placement Officer",
                email: "placement@college.edu",
                role: "external",
            },
            title: "Placement Drive Briefing",
            description:
                "Briefing session before the arrival of recruitment teams.",
            meetingTime: "2025-08-01T09:00:00Z",
            joinusList: [
                {
                    _id: "64bdfd1e16f2b21f1a9c0606",
                    name: "Student Coordinator",
                    email: "coordinator@college.edu",
                    role: "student",
                },
            ],
            joinusModel: ["user"],
            meetingArea: "Training Room 2B",
            createdAt: "2025-07-05T13:00:00Z",
            updatedAt: "2025-07-05T13:00:00Z",
        },
        {
            _id: "64be131e16f2b21f1a9c5555",
            user: {
                _id: "64bdfd1e16f2b21f1a9c0707",
                name: "Dean of Academics",
                email: "dean@college.edu",
                role: "admin",
            },
            title: "Curriculum Development Meeting",
            description:
                "Finalization of updated course structure for next academic year.",
            meetingTime: "2025-08-03T11:00:00Z",
            joinusList: [
                {
                    _id: "64bdfd1e16f2b21f1a9c0808",
                    name: "AI Guest Expert",
                    email: "ai.expert@guest.com",
                    phoneNo: "+917777777777",
                },
                {
                    _id: "64bdfd1e16f2b21f1a9c0909",
                    name: "Student Rep",
                    email: "rep@student.com",
                    role: "student",
                },
            ],
            joinusModel: ["normaluser", "user"],
            meetingArea: "Board Room",
            createdAt: "2025-07-06T10:00:00Z",
            updatedAt: "2025-07-06T10:00:00Z",
        },
    ];
    notices = [
        {
            _id: "64a0a1e1a1e0f0a1e1a1e001",
            title: "Welcome to the New Semester",
            description:
                "All students are requested to check the academic calendar for the new semester.",
            media: [
                {
                    url: "https://ik.imagekit.io/eur1zq65p/Screenshot.pdf",
                    public_id: "sample_image_5",
                },
            ],
            user: "64a0a1e1a1e0f0a1e1a1e111",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            _id: "64a0a1e1a1e0f0a1e1a1e002",
            title: "Library Timing Updated",
            description: "Library will now be open from 8 AM to 8 PM.",
            media: [
                {
                    url: "https://ik.imagekit.io/eur1zq65p/ER.2.drawio.pdf",
                    public_id: "sample_image_4",
                },
            ],
            user: "64a0a1e1a1e0f0a1e1a1e112",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            _id: "64a0a1e1a1e0f0a1e1a1e003",
            title: "Seminar on Cybersecurity",
            description:
                "Join us for a seminar on modern cybersecurity threats and defense.",
            media: [
                {
                    url: "https://ik.imagekit.io/eur1zq65p/alart_hrWjP7bOk.jpeg?updatedAt=1749273285025",
                    public_id: "sample_image_1",
                },
            ],
            user: "64a0a1e1a1e0f0a1e1a1e113",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            _id: "64a0a1e1a1e0f0a1e1a1e004",
            title: "Sports Day Registration Open",
            description:
                "Students interested in participating in sports day, please register online.",
            media: [
                {
                    url: "https://ik.imagekit.io/eur1zq65p/ER.2.drawio.pdf",
                    public_id: "sample_image_3",
                },
            ],
            user: "64a0a1e1a1e0f0a1e1a1e114",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            _id: "64a0a1e1a1e0f0a1e1a1e005",
            title: "Exam Guidelines Released",
            description:
                "Please check the portal for updated exam rules and instructions.",
            media: [
                {
                    url: "https://ik.imagekit.io/eur1zq65p/alart_hrWjP7bOk.jpeg?updatedAt=1749273285025",
                    public_id: "sample_image_2",
                },
            ],
            user: "64a0a1e1a1e0f0a1e1a1e115",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
    syllabus = [
        {
            user: "64a9f0cd1c3ae99d9a9e1111",
            semester: "1",
            paperCode: "CS101",
            paperName: "IntroCS",
            media: [
                {
                    mediaUrl: "https://example.com/files/intro-cs.pdf",
                    public_id: "syllabus/intro-cs-1",
                },
            ],
        },
        {
            user: "64a9f0cd1c3ae99d9a9e2222",
            semester: "2",
            paperCode: "CS201",
            paperName: "DataStr",
            media: [
                {
                    mediaUrl: "https://example.com/files/data-structures.pdf",
                    public_id: "syllabus/data-structures-2",
                },
            ],
        },
        {
            user: "64a9f0cd1c3ae99d9a9e3333",
            semester: "3",
            paperCode: "CS301",
            paperName: "Algo",
            media: [
                {
                    mediaUrl: "https://example.com/files/algorithms.pdf",
                    public_id: "syllabus/algorithms-3",
                },
            ],
        },
        {
            user: "64a9f0cd1c3ae99d9a9e4444",
            semester: "4",
            paperCode: "CS401",
            paperName: "DBMS",
            media: [
                {
                    mediaUrl: "https://example.com/files/dbms.pdf",
                    public_id: "syllabus/dbms-4",
                },
            ],
        },
        {
            user: "64a9f0cd1c3ae99d9a9e5555",
            semester: "5",
            paperCode: "CS501",
            paperName: "OS",
            media: [
                {
                    mediaUrl: "https://example.com/files/os.pdf",
                    public_id: "syllabus/os-5",
                },
            ],
        },
    ];

    routine=[
        {
          "_id": "r1",
          "semester": "1",
          "schedules": [
            {
              "dayName": "Monday",
              "timeSlots": [
                {
                  "_id": "ts1",
                  "paperCode": "CS101",
                  "paperName": "Intro to CS",
                  "startTime": "09:00",
                  "endTime": "10:00",
                  "professorModel": "user",
                  "professor": {
                    "_id": "u1",
                    "name": "Dr. Suman Roy",
                    "email": "suman@univ.edu"
                  }
                }
              ]
            }
          ]
        },
        {
          "_id": "r2",
          "semester": "2",
          "schedules": [
            {
              "dayName": "Tuesday",
              "timeSlots": [
                {
                  "_id": "ts2",
                  "paperCode": "CS201",
                  "paperName": "Data Structures",
                  "startTime": "10:00",
                  "endTime": "11:00",
                  "professorModel": "normaluser",
                  "professor": {
                    "_id": "n1",
                    "name": "Mr. Arjun Das",
                    "email": "arjun@college.edu"
                  }
                }
              ]
            }
          ]
        },
        {
          "_id": "r3",
          "semester": "3",
          "schedules": [
            {
              "dayName": "Wednesday",
              "timeSlots": [
                {
                  "_id": "ts3",
                  "paperCode": "CS301",
                  "paperName": "Algorithms",
                  "startTime": "11:00",
                  "endTime": "12:00",
                  "professorModel": "user",
                  "professor": {
                    "_id": "u2",
                    "name": "Dr. Neha Sharma",
                    "email": "neha@univ.edu"
                  }
                },
                {
                  "_id": "ts4",
                  "paperCode": "CS302",
                  "paperName": "Operating Systems",
                  "startTime": "12:00",
                  "endTime": "13:00",
                  "professorModel": "normaluser",
                  "professor": {
                    "_id": "n2",
                    "name": "Mrs. Priya Sen",
                    "email": "priya@college.edu"
                  }
                }
              ]
            }
          ]
        },
        {
          "_id": "r4",
          "semester": "4",
          "schedules": [
            {
              "dayName": "Thursday",
              "timeSlots": [
                {
                  "_id": "ts5",
                  "paperCode": "CS401",
                  "paperName": "Computer Networks",
                  "startTime": "09:30",
                  "endTime": "10:30",
                  "professorModel": "user",
                  "professor": {
                    "_id": "u3",
                    "name": "Prof. Rahul Mehta",
                    "email": "rahul@univ.edu"
                  }
                }
              ]
            }
          ]
        },
        {
          "_id": "r5",
          "semester": "5",
          "schedules": [
            {
              "dayName": "Friday",
              "timeSlots": [
                {
                  "_id": "ts6",
                  "paperCode": "CS501",
                  "paperName": "DBMS",
                  "startTime": "10:30",
                  "endTime": "11:30",
                  "professorModel": "normaluser",
                  "professor": {
                    "_id": "n3",
                    "name": "Mr. Tanmay Ghosh",
                    "email": "tanmay@college.edu"
                  }
                }
              ]
            }
          ]
        }
      ]
      
}

export default new SampleData();
