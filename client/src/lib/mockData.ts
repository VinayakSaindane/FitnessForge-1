export const mockBookings = [
    {
        id: 1,
        status: 'confirmed',
        class: {
            name: 'HIIT Explosion',
            instructor: { name: 'Sarah Connor' },
        },
        schedule: {
            dayOfWeek: 1, // Monday
            startTime: '10:00',
        }
    },
    {
        id: 2,
        status: 'completed',
        class: {
            name: 'Yoga Flow',
            instructor: { name: 'Zen Master' },
        },
        schedule: {
            dayOfWeek: 3, // Wednesday
            startTime: '08:00',
        }
    }
];

export const mockPersonalTraining = [
    {
        id: 1,
        status: 'scheduled',
        trainer: { name: 'John Rambo' },
        startTime: '14:00',
        date: '2024-05-20'
    }
];

export const mockUpcomingClasses = [
    {
        id: 101,
        startTime: '09:00',
        endTime: '10:00',
        class: {
            name: 'Power Lifting',
            intensity: 'High',
            instructor: { name: 'Arnold S.' }
        }
    },
    {
        id: 102,
        startTime: '12:00',
        endTime: '13:00',
        class: {
            name: 'Spin Class',
            intensity: 'Medium',
            instructor: { name: 'Lance A.' }
        }
    },
    {
        id: 103,
        startTime: '17:30',
        endTime: '18:30',
        class: {
            name: 'Evening Yoga',
            intensity: 'Low',
            instructor: { name: 'Dhalsim' }
        }
    }
];

export const mockClassesList = [
    {
        id: 1,
        name: "HIIT Explosion",
        description: "High intensity interval training to burn fat fast.",
        instructor: { name: "Sarah Connor", image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop" },
        intensity: "high",
        type: "hiit",
        duration: 60,
        calories: 800,
        image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&fit=crop"
    },
    {
        id: 2,
        name: "Yoga Flow",
        description: "Find balance and harmony in mind and body.",
        instructor: { name: "Zen Master", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop" },
        intensity: "low",
        type: "yoga",
        duration: 60,
        calories: 300,
        image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&fit=crop"
    },
    {
        id: 3,
        name: "Power Lifting",
        description: "Build serious strength and muscle mass.",
        instructor: { name: "Arnold S.", image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop" },
        intensity: "high",
        type: "strength",
        duration: 90,
        calories: 600,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop"
    }
];

export const mockSchedulesList = [
    {
        id: 1,
        classId: 1,
        dayOfWeek: 1,
        startTime: "10:00",
        endTime: "11:00",
        spotsTotal: 20,
        spotsBooked: 15
    },
    {
        id: 2,
        classId: 2,
        dayOfWeek: 3,
        startTime: "08:00",
        endTime: "09:00",
        spotsTotal: 15,
        spotsBooked: 5
    },
    {
        id: 3,
        classId: 3,
        dayOfWeek: 5,
        startTime: "18:00",
        endTime: "19:30",
        spotsTotal: 10,
        spotsBooked: 8
    }
];

export const mockTrainers = [
    {
        id: 1,
        name: 'Sarah Connor',
        specialty: 'HIIT & Cardio',
        bio: 'Training to save the future.',
        image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop'
    },
    {
        id: 2,
        name: 'Arnold S.',
        specialty: 'Bodybuilding',
        bio: 'I will help you pump iron.',
        image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop'
    },
    {
        id: 3,
        name: 'Zen Master',
        specialty: 'Yoga & Pilates',
        bio: 'Find your inner peace.',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop'
    }
];
