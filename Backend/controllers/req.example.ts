//@ts-ignore

create = {
  title: "GFG Orientation 2025",
  description: "Orientation session for new GFG members",
  deadline: "2025-03-01T23:59:59.000Z",
  image: File, // image file (multipart on actual request)
  fields: [
    {
      label: "Roll Number",
      name: "rollNo",
      type: "text",
      required: true
    },
    {
      label: "Preferred Team",
      name: "team",
      type: "select",
      required: true,
      options: ["Technical Team", "Design Team", "Media Team"]
    },
    {
      label: "Why do you want to attend?",
      name: "reason",
      type: "textarea",
      required: false
    }
  ]
}

//all are optional...
//@ts-ignore
update = {
  title: "Updated Event Title",
  description: "Updated description",
  deadline: "2025-03-10T23:59:59.000Z",
  isActive: false,
  image: File, // optional new image
  fields: [
    {
      label: "Roll Number",
      name: "rollNo",
      type: "text",
      required: true
    },
    {
      label: "Team Preference",
      name: "team",
      type: "select",
      required: true,
      options: ["Technical Team", "Design Team"]
    }
  ]
}

//@ts-ignore
register={
  responses: {
    rollNo: "25cs3013",
    team: "Technical Team",
    reason: "I want to learn and contribute to GFG"
  }
}





