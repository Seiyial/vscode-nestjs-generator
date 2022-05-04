export const writeTemplateModuleFile = (
	fileName: string,
	resourceNamePascal: string,
	resourceNameKebab: string,
	hasController: boolean,
	extraImportsFromNestCommon: string[] = [],
	customImports: string = "import { PrismaModule } from 'setup/db/prisma.module'",
) => {

	const svc = resourceNamePascal + 'Service';
	const controller = resourceNamePascal + 'Controller';
	return `import { ${ ['Module', ...extraImportsFromNestCommon].join(', ') } } from '@nestjs/common'
${ customImports ? customImports + '\n' : '' }import { ${svc} } from './${resourceNameKebab}.service'
${ hasController ? `import { ${controller} } from './${resourceNameKebab}.controller'\n` : ''}
@Module({
	imports: [
		PrismaModule,
	],
	providers: [${svc}],
	controllers: [${hasController ? controller : ''}],
	exports: [${svc}]
})

export class ${ resourceNamePascal }Module {}
`;
};