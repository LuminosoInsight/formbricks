import { prisma } from "@formbricks/database";
import { TActivityFeedItem } from "@formbricks/types/v1/activity";

export const getActivityTimeline = async (personId: string): Promise<TActivityFeedItem[]> => {
  const person = await prisma.person.findUnique({
    where: {
      id: personId,
    },
    include: {
      attributes: {
        include: {
          attributeClass: true,
        },
      },
      displays: {
        include: {
          survey: true,
        },
      },
      sessions: {
        include: {
          events: {
            include: {
              eventClass: true,
            },
          },
        },
      },
    },
  });
  if (!person) {
    throw new Error("No such person found");
  }
  const { attributes, displays, sessions } = person;

  const unifiedAttributes: TActivityFeedItem[] = attributes.map((attribute) => ({
    id: attribute.id,
    type: "attribute",
    createdAt: attribute.createdAt,
    updatedAt: attribute.updatedAt,
    attributeLabel: attribute.attributeClass.name,
    attributeValue: attribute.value,
    actionLabel: null,
    actionDescription: null,
    actionType: null,
    displaySurveyName: null,
  }));
  const unifiedDisplays: TActivityFeedItem[] = displays.map((display) => ({
    id: display.id,
    type: "display",
    createdAt: display.createdAt,
    updatedAt: display.updatedAt,
    attributeLabel: null,
    attributeValue: null,
    actionLabel: null,
    actionDescription: null,
    actionType: null,
    displaySurveyName: display.survey.name,
  }));
  const unifiedEvents: TActivityFeedItem[] = sessions.flatMap((session) =>
    session.events.map((event) => ({
      id: event.id,
      type: "event",
      createdAt: event.createdAt,
      updatedAt: null,
      attributeLabel: null,
      attributeValue: null,
      actionLabel: event.eventClass?.name || null,
      actionDescription: event.eventClass?.description || null,
      actionType: event.eventClass?.type || null,
      displaySurveyName: null,
    }))
  );

  const unifiedList: TActivityFeedItem[] = [...unifiedAttributes, ...unifiedDisplays, ...unifiedEvents];

  return unifiedList;
};
