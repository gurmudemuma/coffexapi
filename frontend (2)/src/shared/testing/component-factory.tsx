/**
 * Component Testing Factory
 * 
 * Provides standardized test generators for different types of components.
 * Reduces boilerplate and ensures consistent testing patterns.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from './test-utils';
import type { ComponentType } from 'react';

// ==============================================================================
// Base Component Test Suite
// ==============================================================================

interface BaseComponentTestOptions {
  name: string;
  component: ComponentType<any>;
  defaultProps?: Record<string, any>;
  requiredProps?: Record<string, any>;
  skipTests?: string[];
}

export const createBaseComponentTests = ({
  name,
  component: Component,
  defaultProps = {},
  requiredProps = {},
  skipTests = [],
}: BaseComponentTestOptions) => {
  const shouldSkip = (testName: string) => skipTests.includes(testName);

  describe(`${name} Component`, () => {
    const defaultTestProps = { ...defaultProps, ...requiredProps };

    if (!shouldSkip('renders')) {
      it('renders without crashing', () => {
        expect(() => {
          renderWithProviders(<Component {...defaultTestProps} />);
        }).not.toThrow();
      });
    }

    if (!shouldSkip('accessibility')) {
      it('has no accessibility violations', async () => {
        const { container } = renderWithProviders(<Component {...defaultTestProps} />);
        
        // Basic accessibility checks
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
          expect(button).toBeVisible();
          if (button.textContent?.trim()) {
            expect(button).toHaveAccessibleName();
          }
        });

        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
          if (input.type !== 'hidden') {
            expect(input).toBeVisible();
          }
        });
      });
    }

    if (!shouldSkip('dataTestId') && defaultTestProps['data-testid']) {
      it('has correct data-testid', () => {
        renderWithProviders(<Component {...defaultTestProps} />);
        expect(screen.getByTestId(defaultTestProps['data-testid'])).toBeInTheDocument();
      });
    }

    if (!shouldSkip('className')) {
      it('applies custom className', () => {
        const customClass = 'custom-test-class';
        renderWithProviders(
          <Component {...defaultTestProps} className={customClass} />
        );
        
        const element = defaultTestProps['data-testid'] 
          ? screen.getByTestId(defaultTestProps['data-testid'])
          : screen.getByRole('button') || screen.getByRole('textbox') || document.body.firstElementChild;
          
        expect(element).toHaveClass(customClass);
      });
    }
  });
};

// ==============================================================================
// Form Component Test Suite
// ==============================================================================

interface FormComponentTestOptions extends BaseComponentTestOptions {
  inputSelector?: string;
  submitSelector?: string;
  validationTests?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export const createFormComponentTests = ({
  name,
  component: Component,
  defaultProps = {},
  requiredProps = {},
  inputSelector = 'textbox',
  submitSelector = 'button[type="submit"]',
  validationTests = {},
  skipTests = [],
}: FormComponentTestOptions) => {
  createBaseComponentTests({ name, component: Component, defaultProps, requiredProps, skipTests });

  describe(`${name} Form Behavior`, () => {
    const defaultTestProps = { ...defaultProps, ...requiredProps };

    if (!skipTests.includes('userInput')) {
      it('handles user input', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Component {...defaultTestProps} />);
        
        const input = screen.getByRole(inputSelector as any);
        await user.type(input, 'test input');
        
        expect(input).toHaveValue('test input');
      });
    }

    if (!skipTests.includes('formSubmission')) {
      it('handles form submission', async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();
        
        renderWithProviders(
          <Component {...defaultTestProps} onSubmit={onSubmit} />
        );
        
        const submitButton = document.querySelector(submitSelector);
        if (submitButton) {
          await user.click(submitButton);
          expect(onSubmit).toHaveBeenCalled();
        }
      });
    }

    if (validationTests.required && !skipTests.includes('requiredValidation')) {
      it('shows validation error for required field', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Component {...defaultTestProps} required />);
        
        const input = screen.getByRole(inputSelector as any);
        await user.click(input);
        await user.tab(); // Focus out
        
        // Check for validation message
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    }

    if (validationTests.minLength && !skipTests.includes('minLengthValidation')) {
      it('validates minimum length', async () => {
        const user = userEvent.setup();
        renderWithProviders(
          <Component {...defaultTestProps} minLength={validationTests.minLength} />
        );
        
        const input = screen.getByRole(inputSelector as any);
        await user.type(input, 'a'.repeat((validationTests.minLength || 0) - 1));
        await user.tab();
        
        expect(screen.getByText(/minimum.*characters/i)).toBeInTheDocument();
      });
    }
  });
};

// ==============================================================================
// Interactive Component Test Suite
// ==============================================================================

interface InteractiveComponentTestOptions extends BaseComponentTestOptions {
  interactions?: {
    click?: boolean;
    hover?: boolean;
    keyboard?: boolean;
    focus?: boolean;
  };
  callbacks?: string[];
}

export const createInteractiveComponentTests = ({
  name,
  component: Component,
  defaultProps = {},
  requiredProps = {},
  interactions = {},
  callbacks = [],
  skipTests = [],
}: InteractiveComponentTestOptions) => {
  createBaseComponentTests({ name, component: Component, defaultProps, requiredProps, skipTests });

  describe(`${name} Interactions`, () => {
    const defaultTestProps = { ...defaultProps, ...requiredProps };

    if (interactions.click && !skipTests.includes('clickInteraction')) {
      it('handles click events', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();
        
        renderWithProviders(
          <Component {...defaultTestProps} onClick={onClick} />
        );
        
        const element = screen.getByRole('button');
        await user.click(element);
        
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    }

    if (interactions.hover && !skipTests.includes('hoverInteraction')) {
      it('handles hover events', async () => {
        const onMouseEnter = vi.fn();
        const onMouseLeave = vi.fn();
        const user = userEvent.setup();
        
        renderWithProviders(
          <Component 
            {...defaultTestProps} 
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        );
        
        const element = screen.getByRole('button');
        await user.hover(element);
        await user.unhover(element);
        
        expect(onMouseEnter).toHaveBeenCalled();
        expect(onMouseLeave).toHaveBeenCalled();
      });
    }

    if (interactions.keyboard && !skipTests.includes('keyboardInteraction')) {
      it('handles keyboard events', async () => {
        const onKeyDown = vi.fn();
        const user = userEvent.setup();
        
        renderWithProviders(
          <Component {...defaultTestProps} onKeyDown={onKeyDown} />
        );
        
        const element = screen.getByRole('button');
        await user.keyboard('{Enter}');
        
        expect(onKeyDown).toHaveBeenCalled();
      });
    }

    callbacks.forEach(callbackName => {
      if (!skipTests.includes(`${callbackName}Callback`)) {
        it(`calls ${callbackName} callback`, async () => {
          const callback = vi.fn();
          const user = userEvent.setup();
          
          renderWithProviders(
            <Component {...defaultTestProps} {...{ [callbackName]: callback }} />
          );
          
          // Trigger the callback (this is generic, might need customization)
          const element = screen.getByRole('button');
          await user.click(element);
          
          expect(callback).toHaveBeenCalled();
        });
      }
    });
  });
};

// ==============================================================================
// Loading State Test Suite
// ==============================================================================

interface LoadingStateTestOptions extends BaseComponentTestOptions {
  loadingProp?: string;
  loadingSelector?: string;
}

export const createLoadingStateTests = ({
  name,
  component: Component,
  defaultProps = {},
  requiredProps = {},
  loadingProp = 'isLoading',
  loadingSelector = '[data-testid="loading-spinner"]',
  skipTests = [],
}: LoadingStateTestOptions) => {
  describe(`${name} Loading States`, () => {
    const defaultTestProps = { ...defaultProps, ...requiredProps };

    if (!skipTests.includes('loadingState')) {
      it('shows loading state when loading', () => {
        renderWithProviders(
          <Component {...defaultTestProps} {...{ [loadingProp]: true }} />
        );
        
        const loadingElement = document.querySelector(loadingSelector);
        expect(loadingElement).toBeInTheDocument();
      });
    }

    if (!skipTests.includes('notLoadingState')) {
      it('hides loading state when not loading', () => {
        renderWithProviders(
          <Component {...defaultTestProps} {...{ [loadingProp]: false }} />
        );
        
        const loadingElement = document.querySelector(loadingSelector);
        expect(loadingElement).not.toBeInTheDocument();
      });
    }
  });
};