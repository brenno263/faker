import type { Faker } from '../..';

export enum Sex {
  Female = 'female',
  Male = 'male',
}

export type SexType = `${Sex}`;

/**
 * Select a definition based on given sex.
 *
 * @param faker Faker instance.
 * @param sex Sex.
 * @param param2 Definitions.
 * @param param2.generic Non-sex definitions.
 * @param param2.female Female definitions.
 * @param param2.male Male definitions.
 * @returns Definition based on given sex.
 */
function selectDefinition(
  faker: Faker,
  sex: SexType | undefined,
  // TODO @Shinigami92 2022-03-21: Remove fallback empty object when `strict: true`
  {
    generic,
    female,
    male,
  }: { generic?: string[]; female?: string[]; male?: string[] } = {}
) {
  let values: string[] | undefined;

  switch (sex) {
    case Sex.Female:
      values = female;
      break;

    case Sex.Male:
      values = male;
      break;

    default:
      values = generic;
      break;
  }

  if (values == null) {
    if (female != null && male != null) {
      values = faker.helpers.arrayElement([female, male]);
    } else {
      values = generic;
    }
  }

  return faker.helpers.arrayElement(values);
}

/**
 * Module to generate people's names and titles.
 */
export class NameModule {
  constructor(private readonly faker: Faker) {
    // Bind `this` so namespaced is working correctly
    for (const name of Object.getOwnPropertyNames(NameModule.prototype)) {
      if (name === 'constructor' || typeof this[name] !== 'function') {
        continue;
      }
      this[name] = this[name].bind(this);
    }
  }

  /**
   * Returns a random first name.
   *
   * @param sex The optional sex to use.
   * Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.name.firstName() // 'Antwan'
   * faker.name.firstName('female') // 'Victoria'
   * faker.name.firstName('male') // 'Tom'
   *
   * @since 2.0.1
   */
  firstName(sex?: SexType): string {
    const { first_name, female_first_name, male_first_name } =
      this.faker.definitions.name;

    return selectDefinition(this.faker, sex, {
      generic: first_name,
      female: female_first_name,
      male: male_first_name,
    });
  }

  /**
   * Returns a random last name.
   *
   * @param sex The optional sex to use.
   * Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.name.lastName() // 'Hauck'
   * faker.name.lastName('female') // 'Grady'
   * faker.name.lastName('male') // 'Barton'
   *
   * @since 2.0.1
   */
  lastName(sex?: SexType): string {
    const { last_name, female_last_name, male_last_name } =
      this.faker.definitions.name;

    return selectDefinition(this.faker, sex, {
      generic: last_name,
      female: female_last_name,
      male: male_last_name,
    });
  }

  /**
   * Returns a random middle name.
   *
   * @param sex The optional sex to use.
   * Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.name.middleName() // 'James'
   * faker.name.middleName('female') // 'Eloise'
   * faker.name.middleName('male') // 'Asher'
   *
   * @since 5.2.0
   */
  middleName(sex?: SexType): string {
    const { middle_name, female_middle_name, male_middle_name } =
      this.faker.definitions.name;

    return selectDefinition(this.faker, sex, {
      generic: middle_name,
      female: female_middle_name,
      male: male_middle_name,
    });
  }

  /**
   * Generates a random full name.
   *
   * @param options An options object. Defaults to `{}`.
   * @param options.firstName The optional first name to use. If not specified a random one will be chosen.
   * @param options.lastName The optional last name to use. If not specified a random one will be chosen.
   * @param options.sex The optional sex to use. Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.name.fullName() // 'Allen Brown'
   * faker.name.fullName({ firstName: 'Joann' }) // 'Joann Osinski'
   * faker.name.fullName({ firstName: 'Marcella', sex: 'female' }) // 'Mrs. Marcella Huels'
   * faker.name.fullName({ lastName: 'Beer' }) // 'Mr. Alfonso Beer'
   * faker.name.fullName({ sex: 'male' }) // 'Fernando Schaefer'
   *
   * @since 7.4.0
   */
  fullName(
    options: {
      firstName?: string;
      lastName?: string;
      sex?: SexType;
    } = {}
  ): string {
    const {
      sex = this.faker.helpers.arrayElement([Sex.Female, Sex.Male]),
      firstName = this.firstName(sex),
      lastName = this.lastName(sex),
    } = options;

    const nameParts: string[] = [];
    const prefix = this.faker.helpers.maybe(() => this.prefix(sex), {
      probability: 0.125,
    });

    if (prefix) {
      nameParts.push(prefix);
    }

    nameParts.push(firstName);
    nameParts.push(lastName);

    const suffix = this.faker.helpers.maybe(() => this.suffix(), {
      probability: 0.125,
    });

    if (suffix) {
      nameParts.push(suffix);
    }

    return nameParts.join(' ');
  }

  /**
   * Returns a random gender.
   *
   * @see faker.name.sex() if you would like to generate binary-gender value
   *
   * @example
   * faker.name.gender() // 'Trans*Man'
   *
   * @since 5.0.0
   */
  gender(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.name.gender);
  }

  /**
   * Returns a random sex.
   *
   * Output of this method is localised, so it should not be used to fill the parameter `sex`
   * available in some other modules for example `faker.name.firstName()`.
   *
   * @see faker.name.gender() if you would like to generate gender related values.
   *
   * @example
   * faker.name.sex() // 'female'
   *
   * @since 7.5.0
   */
  sex(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.name.sex);
  }

  /**
   * Returns a random sex type.
   *
   * @example
   * faker.name.sexType() // Sex.Female
   *
   * @since 7.5.0
   */
  sexType(): SexType {
    return this.faker.helpers.objectValue(Sex);
  }

  /**
   * Returns a random name prefix.
   *
   * @param sex The optional sex to use. Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.name.prefix() // 'Miss'
   * faker.name.prefix('female') // 'Ms.'
   * faker.name.prefix('male') // 'Mr.'
   *
   * @since 2.0.1
   */
  prefix(sex?: SexType): string {
    const { prefix, female_prefix, male_prefix } = this.faker.definitions.name;

    return selectDefinition(this.faker, sex, {
      generic: prefix,
      female: female_prefix,
      male: male_prefix,
    });
  }

  /**
   * Returns a random name suffix.
   *
   * @example
   * faker.name.suffix() // 'DDS'
   *
   * @since 2.0.1
   */
  suffix(): string {
    // TODO @Shinigami92 2022-03-21: Add female_suffix and male_suffix
    return this.faker.helpers.arrayElement(this.faker.definitions.name.suffix);
  }

  /**
   * Generates a random job title.
   *
   * @example
   * faker.name.jobTitle() // 'Global Accounts Engineer'
   *
   * @since 3.0.0
   */
  jobTitle(): string {
    return `${this.jobDescriptor()} ${this.jobArea()} ${this.jobType()}`;
  }

  /**
   * Generates a random job descriptor.
   *
   * @example
   * faker.name.jobDescriptor() // 'Customer'
   *
   * @since 3.0.0
   */
  jobDescriptor(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.name.title.descriptor
    );
  }

  /**
   * Generates a random job area.
   *
   * @example
   * faker.name.jobArea() // 'Brand'
   *
   * @since 3.0.0
   */
  jobArea(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.name.title.level
    );
  }

  /**
   * Generates a random job type.
   *
   * @example
   * faker.name.jobType() // 'Assistant'
   *
   * @since 3.0.0
   */
  jobType(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.name.title.job
    );
  }
}
