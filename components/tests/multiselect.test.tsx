import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSelect, MultiSelectOption } from '@/components/multiselect';

test('renders MultiSelect component', () => {
  render(
    <MultiSelect>
      <MultiSelectOption value="option1">Option 1</MultiSelectOption>
      <MultiSelectOption value="option2">Option 2</MultiSelectOption>
      <MultiSelectOption value="option3">Option 3</MultiSelectOption>
    </MultiSelect>
  );

  const trigger = screen.getByText('Select an option');
  expect(trigger).toBeInTheDocument();
});

test('selects options in MultiSelect', () => {
  const handleValueChange = jest.fn();

  render(
    <MultiSelect onValueChange={handleValueChange}>
      <MultiSelectOption value="option1">Option 1</MultiSelectOption>
      <MultiSelectOption value="option2">Option 2</MultiSelectOption>
      <MultiSelectOption value="option3">Option 3</MultiSelectOption>
    </MultiSelect>
  );

  const option1 = screen.getByText('Option 1');
  const option2 = screen.getByText('Option 2');
  const option3 = screen.getByText('Option 3');

  fireEvent.click(option1);
  fireEvent.click(option2);
  fireEvent.click(option3);

  expect(handleValueChange).toHaveBeenCalledWith(['option1', 'option2', 'option3']);
});