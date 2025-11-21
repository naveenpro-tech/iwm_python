export interface HelpTopic {
  id: string
  title: string
  category: string
  content: string
  lastUpdated: string
  relatedTopics?: string[]
}

export interface HelpCategory {
  id: string
  name: string
  description: string
  iconName: string
  topicCount: number
}

export interface FAQItem {
  question: string
  answer: string
}
