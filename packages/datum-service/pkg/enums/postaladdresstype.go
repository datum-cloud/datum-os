package enums

import (
	"fmt"
	"io"
	"strings"
)

type PostalAddressType string

var (
	PostalAddressTypeInvalid  PostalAddressType = "INVALID"
	PostalAddressTypeMailing  PostalAddressType = "MAILING"
	PostalAddressTypeBilling  PostalAddressType = "BILLING"
	PostalAddressTypePhysical PostalAddressType = "PHYSICAL"
)

// Values returns a slice of strings that represents all the possible values of the PostalAddressType enum.
// Possible default values are "MAILING", "BILLING", and "PHYSICAL".
func (PostalAddressType) Values() (kinds []string) {
	for _, s := range []PostalAddressType{PostalAddressTypeMailing, PostalAddressTypeBilling, PostalAddressTypePhysical} {
		kinds = append(kinds, string(s))
	}

	return
}

// String returns the PostalAddressType as a string
func (r PostalAddressType) String() string {
	return string(r)
}

// ToPostalAddressType returns the PostalAddressType based on string input
func ToPostalAddressType(r string) *PostalAddressType {
	switch r := strings.ToUpper(r); r {
	case PostalAddressTypeMailing.String():
		return &PostalAddressTypeMailing
	case PostalAddressTypeBilling.String():
		return &PostalAddressTypeBilling
	case PostalAddressTypePhysical.String():
		return &PostalAddressTypePhysical
	default:
		return &PostalAddressTypeInvalid
	}
}

// MarshalGQL implement the Marshaler interface for gqlgen
func (r PostalAddressType) MarshalGQL(w io.Writer) {
	_, _ = w.Write([]byte(`"` + r.String() + `"`))
}

// UnmarshalGQL implement the Unmarshaler interface for gqlgen
func (r *PostalAddressType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("wrong type for PostalAddressType, got: %T", v) //nolint:err113
	}

	*r = PostalAddressType(str)

	return nil
}
