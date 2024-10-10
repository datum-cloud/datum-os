package enums

import (
	"fmt"
	"io"
	"strconv"
	"strings"
)

type OnboardingState string

var (
	OnboardingStateUnspecified OnboardingState = "UNSPECIFIED"
	OnboardingStatePending     OnboardingState = "PENDING"
	OnboardingStateActive      OnboardingState = "ACTIVE"
	OnboardingStateInactive    OnboardingState = "INACTIVE"
)

func (OnboardingState) Values() (kinds []string) {
	for _, s := range []OnboardingState{OnboardingStateUnspecified, OnboardingStatePending, OnboardingStateActive, OnboardingStateInactive} {
		kinds = append(kinds, string(s))
	}

	return
}

func (r OnboardingState) String() string {
	return string(r)
}

func ToOnboardingState(r string) *OnboardingState {
	switch r := strings.ToUpper(r); r {
	case OnboardingStatePending.String():
		return &OnboardingStatePending
	case OnboardingStateActive.String():
		return &OnboardingStateActive
	case OnboardingStateInactive.String():
		return &OnboardingStateInactive
	default:
		return &OnboardingStateUnspecified
	}
}

// MarshalGQL implement the Marshaler interface for gqlgen
func (r OnboardingState) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(r.String()))
}

// UnmarshalGQL implement the Unmarshaler interface for gqlgen
func (r *OnboardingState) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("wrong type for OnboardingState, got: %T", v) //nolint:err113
	}

	*r = OnboardingState(str)

	return nil
}
