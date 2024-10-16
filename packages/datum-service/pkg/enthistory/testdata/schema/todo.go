package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"

	"github.com/datum-cloud/datum-os/pkg/enthistory"
	"github.com/datum-cloud/datum-os/pkg/fgax/entfga"
)

type Todo struct {
	ent.Schema
}

func (Todo) Fields() []ent.Field {
	return []ent.Field{
		field.String("item"),
		field.Time("due_date"),
	}
}

func (Todo) Indexes() []ent.Index {
	return []ent.Index{}
}

func (Todo) Annotations() []schema.Annotation {
	return []schema.Annotation{
		enthistory.Annotations{
			Exclude: true,
		},
		entfga.Annotations{
			NillableIDField: true,
			IncludeHooks:    false,
		},
	}
}
