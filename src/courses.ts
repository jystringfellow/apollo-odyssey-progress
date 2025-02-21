import { CourseInfo, CertificationName, TrackName } from './types';

export const courses: Record<string, CourseInfo> = {
  "lift-off-part1/v2": {
    title: "Lift-off I: Basics",
    tracks: ['Everyone'],
    certification: {
      name: 'Associate',
      order: 1
    }
  },
  "lift-off-part2/v2": {
    title: "Lift-off II: Resolvers",
    tracks: ['Everyone'],
    certification: {
      name: 'Associate',
      order: 2
    }
  },
  "lift-off-part3/v2": {
    title: "Lift-off III: Arguments",
    tracks: ['Everyone'],
    certification: {
      name: 'Associate',
      order: 3
    }
  },
  "lift-off-part4/v2": {
    title: "Lift-off IV: Mutations",
    tracks: ['Everyone'],
    certification: {
      name: 'Associate',
      order: 4
    }
  },
  "voyage-part1": {
    title: "Voyage I: Federation from Day One",
    tracks: ['Advanced'],
    certification: {
      name: 'Professional',
      order: 1
    }
  },
  "voyage-part2": {
    title: "Voyage II: Federating the Monolith",
    tracks: ['Advanced'],
    certification: {
      name: 'Professional',
      order: 2
    }
  },
  "voyage-part3": {
    title: "Voyage III: Federation in Production",
    tracks: ['Advanced'],
    certification: {
      name: 'Professional',
      order: 3
    }
  },
  "introduction-to-federation": {
    title: "Introduction to Apollo Federation",
    tracks: ['Everyone']
  },
  "side-quest-intermediate-schema-design": {
    title: "Intermediate Schema Design",
    tracks: ['Advanced']
  },
  "schema-design-best-practices": {
    title: "Enterprise best practices: Schema design",
    tracks: ['Advanced']
  },
  "effective-stewardship": {
    title: "Enterprise best practices: Effective supergraph stewardship",
    tracks: ['Advanced']
  },
  contracts: {
    title: "Enterprise best practices: Contracts",
    tracks: ['Advanced']
  },
  "side-quest-auth": {
    title: "Authentication & Authorization",
    tracks: ['Advanced']
  },
  "router-performance": {
    title: "Performance in the router",
    tracks: ['Advanced']
  },
  "supergraph-observability": {
    title: "Enterprise best practices: Supergraph observability",
    tracks: ['Advanced']
  },
  "router-extensibility": {
    title: "Enterprise best practices: Router extensibility",
    tracks: ['Advanced']
  },
  "apollo-kotlin-android-part1": {
    title: "Android Development with Apollo Kotlin: Codegen and Queries",
    tracks: ['Android']
  },
  "apollo-kotlin-android-part2": {
    title: "Android Development with Apollo Kotlin: Pagination, Mutations, and Subscriptions",
    tracks: ['Android']
  },
  "intro-hotchocolate": {
    title: "Intro to GraphQL with .NET (C#) & Hot Chocolate",
    tracks: ['Backend']
  },
  "federation-hotchocolate": {
    title: "Federation with .NET (C#) & Hot Chocolate",
    tracks: ['Backend']
  },
  "client-side-graphql-react": {
    title: "Client-side GraphQL with React & Apollo",
    tracks: ['Frontend']
  },
  "apollo-ios-swift-part1": {
    title: "Apollo iOS and Swift: Codegen and Queries",
    tracks: ['iOS']
  },
  "apollo-ios-swift-part2": {
    title: "Apollo iOS and Swift: Pagination, Mutations, and Subscriptions",
    tracks: ['iOS']
  },
  testing: {
    title: "Enterprise best practices: Testing",
    tracks: ['Android', 'iOS', 'Frontend']
  },
};

export const certifications: Record<CertificationName, {
  name: string;
  description?: string;
}> = {
  Associate: {
    name: "Apollo Graph Developer - Associate",
    description: "Complete all courses to earn your Associate certification"
  },
  Professional: {
    name: "Apollo Graph Developer - Professional",
    description: "Complete all courses to earn your Professional certification"
  }
};

export function getCoursesByTrack(track: string) {
  return Object.entries(courses)
    .filter(([_, info]) => info.tracks.includes(track as any))
    .map(([id]) => id);
}

export function getCertificationCourses(certName: CertificationName, track: TrackName) {
  return Object.entries(courses)
    .filter(([_, info]) => 
      info.certification?.name === certName && 
      info.tracks.includes(track)
    )
    .sort((a, b) => 
      (a[1].certification?.order || 0) - (b[1].certification?.order || 0)
    )
    .map(([id]) => id);
}
