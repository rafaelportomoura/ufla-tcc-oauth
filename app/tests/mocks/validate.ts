export class MockValidator {
  static invalidRequired(property: string): string {
    return `"${property}" is required`;
  }

  static invalidType(property: string, _type: string): string {
    const indefinite_article_types = ['object', 'integer'];
    const indefinite_article = indefinite_article_types.includes(_type) ? 'an' : 'a';
    return `"${property}" must be ${indefinite_article} ${_type}`;
  }

  static invalidEmpty(property: string): string {
    return `"${property}" is not allowed to be empty`;
  }

  static invalidPositive(property: string): string {
    return this.invalidType(property, 'positive number');
  }

  static invalidMinNumber(property: string, min = 1): string {
    return `"${property}" must be larger than or equal to ${min}`;
  }

  static invalidMaxNumber(property: string, max: number): string {
    return `"${property}" must be less than or equal to ${max}`;
  }

  static invalidValue<T = unknown>(property: string, values: Array<T>): string {
    return `"${property}" must be one of [${values.join(', ')}]`;
  }

  static missingPeer(property: string, peer: string): string {
    return `"${property}" missing required peer "${peer}"`;
  }

  static emptyPartialBody(min: number): string {
    return `"""value" must have at least ${min} children`;
  }

  static invalidForbidden(property: string): string {
    return `"${property}" is not allowed`;
  }
}
