const LLMOS_REGEX = /^(.*\.)?llmos\.ai\//;

/**
 * Regular expression to match labels that should be ignored.
 */
export const LABELS_TO_IGNORE_REGEX = [LLMOS_REGEX];

/**
 * Regular expression to match annotations that should be ignored.
 */
export const ANNOTATIONS_TO_IGNORE_REGEX = [LLMOS_REGEX];

export const DESCRIPTION = "field.cattle.io/description";
