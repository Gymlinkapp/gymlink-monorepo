import { User } from '../types/user';

type Plans = {
  movements: {
    label: string;
  }[];
  isGoingToday: boolean;
  date: string;
};

export const findUsersPlansToday = (plans: User['gymPlans']): Plans | null => {
  if (!plans) return null;

  const todayPlan = plans.find((plan) => {
    const today = new Date();
    const planDate = new Date(plan.date);
    return (
      today.getUTCFullYear() === planDate.getUTCFullYear() &&
      today.getUTCMonth() === planDate.getUTCMonth() &&
      today.getUTCDate() === planDate.getUTCDate()
    );
  });

  return todayPlan || null;
};
