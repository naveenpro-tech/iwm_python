"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export function ProfileInfoTab({ id }: { id: string }) {
  // Sample data for profile information
  const profileInfo = {
    bio: "Anurag Kashyap is an Indian film director, writer, editor, producer and actor known for his work in Hindi cinema. He is the recipient of several accolades, including four Filmfare Awards. For his contributions to film, the Government of France awarded him the Ordre des Arts et des Lettres (Knight of the Order of Arts and Letters) in 2013.",
    education: [
      {
        institution: "Hansraj College, Delhi University",
        degree: "Bachelor of Arts in Zoology",
        year: "1993",
      },
    ],
    career: [
      {
        title: "Director",
        company: "Phantom Films",
        startYear: "2011",
        endYear: "2018",
        description: "Co-founded Phantom Films with Vikramaditya Motwane, Vikas Bahl and Madhu Mantena.",
      },
      {
        title: "Director & Producer",
        company: "Anurag Kashyap Films",
        startYear: "2009",
        endYear: "Present",
        description: "Founded own production company to produce independent films.",
      },
      {
        title: "Screenwriter",
        company: "Ram Gopal Varma Productions",
        startYear: "1998",
        endYear: "2003",
        description: "Wrote screenplays for various films including Satya and Kaun.",
      },
    ],
    achievements: [
      "National Film Award for Best Screenplay for Lunchbox (2014)",
      "Filmfare Award for Best Dialogue for Gangs of Wasseypur (2013)",
      "Ordre des Arts et des Lettres (Knight of the Order of Arts and Letters) by the Government of France (2013)",
      "FICCI Frames Excellence Award for Best Director for Dev.D (2010)",
    ],
    skills: ["Directing", "Screenwriting", "Film Production", "Acting", "Film Editing"],
    languages: ["Hindi", "English", "Punjabi"],
  }

  return (
    <div className="space-y-6 mt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Biography</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{profileInfo.bio}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profileInfo.education.map((edu, index) => (
                <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="font-medium">{edu.institution}</div>
                  <div>{edu.degree}</div>
                  <div className="text-sm text-muted-foreground">{edu.year}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Career History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profileInfo.career.map((job, index) => (
                <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="font-medium">{job.title}</div>
                  <div>{job.company}</div>
                  <div className="text-sm text-muted-foreground">
                    {job.startYear} - {job.endYear}
                  </div>
                  <div className="mt-2">{job.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {profileInfo.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Skills & Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-medium mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {profileInfo.skills.map((skill, index) => (
                      <div key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Languages</div>
                  <div className="flex flex-wrap gap-2">
                    {profileInfo.languages.map((language, index) => (
                      <div key={index} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                        {language}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
