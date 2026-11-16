type WeekLesson = { week: number; status: string };

/**
 * Primary lessons are intentionally sequential: a later week can never be
 * opened or shown as completed before every earlier week is complete.
 */
export function primaryWeekProgression(lessons: WeekLesson[]) {
  const weeks = [1, 2, 3, 4];
  const lessonFor = (week: number) => lessons.find((lesson) => lesson.week === week);
  const completedInOrder = (week: number) => weeks
    .filter((candidate) => candidate <= week)
    .every((candidate) => lessonFor(candidate)?.status === 'completed');
  const isUnlocked = (week: number) => week === 1 || completedInOrder(week - 1);
  const isCompleted = (week: number) => isUnlocked(week) && completedInOrder(week);
  const activeWeek = weeks.find((week) => isUnlocked(week) && !isCompleted(week))
    ?? weeks.filter(isUnlocked).at(-1)
    ?? 1;

  return { activeWeek, isUnlocked, isCompleted };
}
