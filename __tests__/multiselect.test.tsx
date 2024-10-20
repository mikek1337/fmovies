import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSelect, MultiSelectOption, MultiSelectTrigger } from '@/components/multiselect';
import React from 'react';


describe('renders MultiSelect component', () => {
  it('renders MultiSelect component', () => {
  render(
    <MultiSelect>
      <MultiSelectTrigger defaultText='Select an option' />
      <MultiSelectOption value="option1">Option 1</MultiSelectOption>
      <MultiSelectOption value="option2">Option 2</MultiSelectOption>
      <MultiSelectOption value="option3">Option 3</MultiSelectOption>
    </MultiSelect>
  );

  const trigger = screen.getByText('Select an option');
  fireEvent.click(trigger);
  expect(screen.getByText('Option 1')).toBeInTheDocument();
  expect(trigger).toBeInTheDocument();
});
it('selects options in MultiSelect', () => {
  const handleValueChange = jest.fn();

  render(
    <MultiSelect onValueChange={handleValueChange}>
      <MultiSelectTrigger defaultText='Select an option' />
      <MultiSelectOption value="option1">Option 1</MultiSelectOption>
      <MultiSelectOption value="option2">Option 2</MultiSelectOption>
      <MultiSelectOption value="option3">Option 3</MultiSelectOption>
    </MultiSelect>
  );

  const options = screen.getAllByRole('checkbox');
  const option1 = options[0];
  const option2 = options[1];
  const option3 = options[2];
  
  fireEvent.click(option1);
  fireEvent.click(option2);
  fireEvent.click(option3);

  expect(handleValueChange).toHaveBeenCalledWith(['option1', 'option2', 'option3']);
});
})
