export type DiodeType = {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  category: string;
  packageStyle: string;
  symbol: string;
  forwardBehavior: string;
  reverseBehavior: string;
  keyFeature: string;
  typicalUse: string;
  applications: string[];
  comparisonFocus: string;
  notes: string;
  partNumber?: string;
  specifications?: Array<{
    label: string;
    value: string;
  }>;
};
