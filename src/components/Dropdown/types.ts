export type DropdownProps = {
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  onPress?: () => void;
  onOpenChange?: (open: boolean) => void;
};
