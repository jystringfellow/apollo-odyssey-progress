export const GET_USER_PROGRESS = `query GetUser {
  me {
    ... on User {
      ...User
      __typename
    }
    __typename
  }
}

fragment User on User {
  id
  fullName
  email
  courses: odysseyCourses {
    ...Course
    __typename
  }
  __typename
}

fragment Course on OdysseyCourse {
  id
  completedAt
  enrolledAt
  __typename
}`; 