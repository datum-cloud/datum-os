// Code generated by ent, DO NOT EDIT.

package orgmembership

import (
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/datum-cloud/datum-os/pkg/entx/vanilla/_example/ent/enums"
	"github.com/datum-cloud/datum-os/pkg/entx/vanilla/_example/ent/predicate"
)

// ID filters vertices based on their ID field.
func ID(id string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldEQ(FieldID, id))
}

// IDEQ applies the EQ predicate on the ID field.
func IDEQ(id string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldEQ(FieldID, id))
}

// IDNEQ applies the NEQ predicate on the ID field.
func IDNEQ(id string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldNEQ(FieldID, id))
}

// IDIn applies the In predicate on the ID field.
func IDIn(ids ...string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldIn(FieldID, ids...))
}

// IDNotIn applies the NotIn predicate on the ID field.
func IDNotIn(ids ...string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldNotIn(FieldID, ids...))
}

// IDGT applies the GT predicate on the ID field.
func IDGT(id string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldGT(FieldID, id))
}

// IDGTE applies the GTE predicate on the ID field.
func IDGTE(id string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldGTE(FieldID, id))
}

// IDLT applies the LT predicate on the ID field.
func IDLT(id string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldLT(FieldID, id))
}

// IDLTE applies the LTE predicate on the ID field.
func IDLTE(id string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldLTE(FieldID, id))
}

// IDEqualFold applies the EqualFold predicate on the ID field.
func IDEqualFold(id string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldEqualFold(FieldID, id))
}

// IDContainsFold applies the ContainsFold predicate on the ID field.
func IDContainsFold(id string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldContainsFold(FieldID, id))
}

// OrganizationID applies equality check predicate on the "organization_id" field. It's identical to OrganizationIDEQ.
func OrganizationID(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldEQ(FieldOrganizationID, v))
}

// UserID applies equality check predicate on the "user_id" field. It's identical to UserIDEQ.
func UserID(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldEQ(FieldUserID, v))
}

// RoleEQ applies the EQ predicate on the "role" field.
func RoleEQ(v enums.Role) predicate.OrgMembership {
	vc := v
	return predicate.OrgMembership(sql.FieldEQ(FieldRole, vc))
}

// RoleNEQ applies the NEQ predicate on the "role" field.
func RoleNEQ(v enums.Role) predicate.OrgMembership {
	vc := v
	return predicate.OrgMembership(sql.FieldNEQ(FieldRole, vc))
}

// RoleIn applies the In predicate on the "role" field.
func RoleIn(vs ...enums.Role) predicate.OrgMembership {
	v := make([]any, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.OrgMembership(sql.FieldIn(FieldRole, v...))
}

// RoleNotIn applies the NotIn predicate on the "role" field.
func RoleNotIn(vs ...enums.Role) predicate.OrgMembership {
	v := make([]any, len(vs))
	for i := range v {
		v[i] = vs[i]
	}
	return predicate.OrgMembership(sql.FieldNotIn(FieldRole, v...))
}

// OrganizationIDEQ applies the EQ predicate on the "organization_id" field.
func OrganizationIDEQ(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldEQ(FieldOrganizationID, v))
}

// OrganizationIDNEQ applies the NEQ predicate on the "organization_id" field.
func OrganizationIDNEQ(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldNEQ(FieldOrganizationID, v))
}

// OrganizationIDIn applies the In predicate on the "organization_id" field.
func OrganizationIDIn(vs ...string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldIn(FieldOrganizationID, vs...))
}

// OrganizationIDNotIn applies the NotIn predicate on the "organization_id" field.
func OrganizationIDNotIn(vs ...string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldNotIn(FieldOrganizationID, vs...))
}

// OrganizationIDGT applies the GT predicate on the "organization_id" field.
func OrganizationIDGT(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldGT(FieldOrganizationID, v))
}

// OrganizationIDGTE applies the GTE predicate on the "organization_id" field.
func OrganizationIDGTE(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldGTE(FieldOrganizationID, v))
}

// OrganizationIDLT applies the LT predicate on the "organization_id" field.
func OrganizationIDLT(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldLT(FieldOrganizationID, v))
}

// OrganizationIDLTE applies the LTE predicate on the "organization_id" field.
func OrganizationIDLTE(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldLTE(FieldOrganizationID, v))
}

// OrganizationIDContains applies the Contains predicate on the "organization_id" field.
func OrganizationIDContains(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldContains(FieldOrganizationID, v))
}

// OrganizationIDHasPrefix applies the HasPrefix predicate on the "organization_id" field.
func OrganizationIDHasPrefix(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldHasPrefix(FieldOrganizationID, v))
}

// OrganizationIDHasSuffix applies the HasSuffix predicate on the "organization_id" field.
func OrganizationIDHasSuffix(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldHasSuffix(FieldOrganizationID, v))
}

// OrganizationIDEqualFold applies the EqualFold predicate on the "organization_id" field.
func OrganizationIDEqualFold(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldEqualFold(FieldOrganizationID, v))
}

// OrganizationIDContainsFold applies the ContainsFold predicate on the "organization_id" field.
func OrganizationIDContainsFold(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldContainsFold(FieldOrganizationID, v))
}

// UserIDEQ applies the EQ predicate on the "user_id" field.
func UserIDEQ(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldEQ(FieldUserID, v))
}

// UserIDNEQ applies the NEQ predicate on the "user_id" field.
func UserIDNEQ(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldNEQ(FieldUserID, v))
}

// UserIDIn applies the In predicate on the "user_id" field.
func UserIDIn(vs ...string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldIn(FieldUserID, vs...))
}

// UserIDNotIn applies the NotIn predicate on the "user_id" field.
func UserIDNotIn(vs ...string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldNotIn(FieldUserID, vs...))
}

// UserIDGT applies the GT predicate on the "user_id" field.
func UserIDGT(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldGT(FieldUserID, v))
}

// UserIDGTE applies the GTE predicate on the "user_id" field.
func UserIDGTE(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldGTE(FieldUserID, v))
}

// UserIDLT applies the LT predicate on the "user_id" field.
func UserIDLT(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldLT(FieldUserID, v))
}

// UserIDLTE applies the LTE predicate on the "user_id" field.
func UserIDLTE(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldLTE(FieldUserID, v))
}

// UserIDContains applies the Contains predicate on the "user_id" field.
func UserIDContains(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldContains(FieldUserID, v))
}

// UserIDHasPrefix applies the HasPrefix predicate on the "user_id" field.
func UserIDHasPrefix(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldHasPrefix(FieldUserID, v))
}

// UserIDHasSuffix applies the HasSuffix predicate on the "user_id" field.
func UserIDHasSuffix(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldHasSuffix(FieldUserID, v))
}

// UserIDEqualFold applies the EqualFold predicate on the "user_id" field.
func UserIDEqualFold(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldEqualFold(FieldUserID, v))
}

// UserIDContainsFold applies the ContainsFold predicate on the "user_id" field.
func UserIDContainsFold(v string) predicate.OrgMembership {
	return predicate.OrgMembership(sql.FieldContainsFold(FieldUserID, v))
}

// HasOrganization applies the HasEdge predicate on the "organization" edge.
func HasOrganization() predicate.OrgMembership {
	return predicate.OrgMembership(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.Edge(sqlgraph.M2O, false, OrganizationTable, OrganizationColumn),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasOrganizationWith applies the HasEdge predicate on the "organization" edge with a given conditions (other predicates).
func HasOrganizationWith(preds ...predicate.Organization) predicate.OrgMembership {
	return predicate.OrgMembership(func(s *sql.Selector) {
		step := newOrganizationStep()
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// And groups predicates with the AND operator between them.
func And(predicates ...predicate.OrgMembership) predicate.OrgMembership {
	return predicate.OrgMembership(sql.AndPredicates(predicates...))
}

// Or groups predicates with the OR operator between them.
func Or(predicates ...predicate.OrgMembership) predicate.OrgMembership {
	return predicate.OrgMembership(sql.OrPredicates(predicates...))
}

// Not applies the not operator on the given predicate.
func Not(p predicate.OrgMembership) predicate.OrgMembership {
	return predicate.OrgMembership(sql.NotPredicates(p))
}
